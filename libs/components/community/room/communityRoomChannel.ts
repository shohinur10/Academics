/**
 * Community room realtime transport.
 *
 * Architecture:
 * - Local `EventTarget` bus drives optimistic UI for the browser session.
 * - Optional `socketVar` WebSocket forwards `community:*` events when OPEN.
 * - Backend does NOT yet acknowledge room channels — local confirms are NOT
 *   server persistence. Reconnect re-joins tracked rooms but does not sync backlog.
 *
 * Authorization note: client role checks (ADMIN/MODERATOR) are UI gating only.
 * The backend must remain authoritative for moderation and membership.
 */

import { socketVar } from '../../../../apollo/store';
import {
	CommunityMessageStatus,
	CommunityReactionEmoji,
	CommunityRoomMessage,
	CommunityRoomMember,
	CommunityRoomSocketEvent,
	CommunityTypingUser,
} from '../../../types/community/room';
import { getCommunityRoomSeedMessages } from '../../../mock/communityRooms.mock';

type Listener = (payload: CommunityRoomEventPayload) => void;

export type CommunityRoomEventPayload = {
	event: CommunityRoomSocketEvent | string;
	roomSlug: string;
	message?: CommunityRoomMessage;
	messages?: CommunityRoomMessage[];
	clientId?: string;
	messageId?: string;
	typing?: CommunityTypingUser;
	membersOnline?: number;
	cursor?: string | null;
	hasMore?: boolean;
	error?: string;
};

const bus = typeof window !== 'undefined' ? new EventTarget() : null;
const roomStores = new Map<
	string,
	{
		messages: CommunityRoomMessage[];
		nextCursor: number;
		pendingTimers: Set<number>;
		lastSendAt: number;
	}
>();

/** Rooms currently joined in this tab — used for soft reconnect re-join. */
const activeRooms = new Map<string, CommunityRoomMember | null>();

const PAGE_SIZE = 12;
const SEND_RATE_LIMIT_MS = 400;
const socketListeners = new Set<Listener>();
let socketBound: WebSocket | null = null;
let socketMessageHandler: ((msg: MessageEvent) => void) | null = null;
let socketOpenHandler: (() => void) | null = null;

const ensureStore = (roomSlug: string) => {
	let store = roomStores.get(roomSlug);
	if (!store) {
		const seed = getCommunityRoomSeedMessages(roomSlug);
		store = {
			messages: [...seed],
			nextCursor: 0,
			pendingTimers: new Set(),
			lastSendAt: 0,
		};
		roomStores.set(roomSlug, store);
	}
	return store;
};

const clearRoomTimers = (roomSlug: string) => {
	const store = roomStores.get(roomSlug);
	if (!store) return;
	store.pendingTimers.forEach((id) => window.clearTimeout(id));
	store.pendingTimers.clear();
};

const scheduleRoomTask = (roomSlug: string, fn: () => void, delay: number) => {
	const store = ensureStore(roomSlug);
	const id = window.setTimeout(() => {
		store.pendingTimers.delete(id);
		fn();
	}, delay);
	store.pendingTimers.add(id);
	return id;
};

const emitLocal = (payload: CommunityRoomEventPayload) => {
	bus?.dispatchEvent(new CustomEvent('community-room', { detail: payload }));
};

const trySocketSend = (payload: Record<string, unknown>) => {
	const socket = socketVar();
	if (!socket || socket.readyState !== WebSocket.OPEN) return false;
	try {
		socket.send(JSON.stringify(payload));
		return true;
	} catch {
		return false;
	}
};

const bindSocketOnce = () => {
	const socket = socketVar();
	if (!socket || typeof window === 'undefined') return;

	if (socketBound === socket && socketMessageHandler) return;

	if (socketBound && socketMessageHandler) {
		socketBound.removeEventListener('message', socketMessageHandler as EventListener);
	}
	if (socketBound && socketOpenHandler) {
		socketBound.removeEventListener('open', socketOpenHandler as EventListener);
	}

	socketBound = socket;
	socketMessageHandler = (msg: MessageEvent) => {
		try {
			const data = JSON.parse(msg.data as string);
			if (typeof data?.event === 'string' && data.event.startsWith('community:')) {
				socketListeners.forEach((listener) => listener(data as CommunityRoomEventPayload));
			}
		} catch {
			/* ignore non-JSON */
		}
	};
	socketOpenHandler = () => {
		/* Soft reconnect: re-announce joins. Backlog sync requires backend. */
		activeRooms.forEach((member, roomSlug) => {
			trySocketSend({ event: 'community:room:join', roomSlug, member });
		});
	};

	socket.addEventListener('message', socketMessageHandler as EventListener);
	socket.addEventListener('open', socketOpenHandler as EventListener);
};

export const subscribeCommunityRoom = (listener: Listener) => {
	if (!bus) return () => undefined;

	const localHandler = (event: Event) => {
		const custom = event as CustomEvent<CommunityRoomEventPayload>;
		listener(custom.detail);
	};
	bus.addEventListener('community-room', localHandler);
	socketListeners.add(listener);
	bindSocketOnce();

	return () => {
		bus.removeEventListener('community-room', localHandler);
		socketListeners.delete(listener);
	};
};

export const joinCommunityRoom = (roomSlug: string, member: CommunityRoomMember | null) => {
	const store = ensureStore(roomSlug);
	activeRooms.set(roomSlug, member);
	bindSocketOnce();
	trySocketSend({ event: 'community:room:join', roomSlug, member });

	const online = Math.max(1, store.messages.filter((m) => m.author.online).length);
	emitLocal({
		event: 'community:room:join',
		roomSlug,
		membersOnline: online,
	});
	emitLocal({
		event: 'community:presence:updated',
		roomSlug,
		membersOnline: online + (member ? 1 : 0),
	});

	const page = loadOlderMessages(roomSlug, null, true);
	emitLocal({
		event: 'community:messages:page',
		roomSlug,
		messages: page.messages,
		cursor: page.cursor,
		hasMore: page.hasMore,
	});
};

export const leaveCommunityRoom = (roomSlug: string) => {
	clearRoomTimers(roomSlug);
	activeRooms.delete(roomSlug);
	trySocketSend({ event: 'community:room:leave', roomSlug });
	emitLocal({ event: 'community:room:leave', roomSlug });
};

export const loadOlderMessages = (
	roomSlug: string,
	cursor: string | null,
	initial = false,
): { messages: CommunityRoomMessage[]; cursor: string | null; hasMore: boolean } => {
	const store = ensureStore(roomSlug);
	const all = store.messages.filter((m) => !m.deleted);
	if (initial) {
		const slice = all.slice(-PAGE_SIZE);
		const oldest = slice[0];
		const oldestIndex = oldest ? all.findIndex((m) => m.id === oldest.id) : 0;
		return {
			messages: slice,
			cursor: oldestIndex > 0 ? String(oldestIndex) : null,
			hasMore: oldestIndex > 0,
		};
	}
	const end = cursor ? Number(cursor) : all.length;
	const start = Math.max(0, end - PAGE_SIZE);
	const slice = all.slice(start, end);
	return {
		messages: slice,
		cursor: start > 0 ? String(start) : null,
		hasMore: start > 0,
	};
};

export const createCommunityMessage = (input: {
	roomSlug: string;
	clientId: string;
	text: string;
	author: CommunityRoomMember;
	parentId?: string | null;
	/** Force failure for retry UI demos / offline socket simulation */
	forceFail?: boolean;
}): { ok: true } | { ok: false; error: string } => {
	const { roomSlug, clientId, text, author, parentId = null, forceFail } = input;
	const store = ensureStore(roomSlug);
	const now = Date.now();
	if (now - store.lastSendAt < SEND_RATE_LIMIT_MS) {
		emitLocal({
			event: 'community:message:create',
			roomSlug,
			clientId,
			error: 'RATE_LIMITED',
		});
		return { ok: false, error: 'RATE_LIMITED' };
	}
	store.lastSendAt = now;

	trySocketSend({
		event: 'community:message:create',
		roomSlug,
		clientId,
		text,
		parentId,
	});

	if (forceFail) {
		emitLocal({
			event: 'community:message:create',
			roomSlug,
			clientId,
			error: 'MESSAGE_SEND_FAILED',
		});
		return { ok: false, error: 'MESSAGE_SEND_FAILED' };
	}

	scheduleRoomTask(
		roomSlug,
		() => {
			const message: CommunityRoomMessage = {
				id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				clientId,
				roomSlug,
				author,
				text,
				createdAt: new Date().toISOString(),
				replyCount: 0,
				parentId,
				reactions: [],
				status: 'sent',
			};
			store.messages.push(message);
			emitLocal({
				event: 'community:message:created',
				roomSlug,
				message,
				clientId,
			});
		},
		280,
	);
	return { ok: true };
};

export const updateCommunityMessage = (input: {
	roomSlug: string;
	messageId: string;
	text: string;
	forceFail?: boolean;
}) => {
	const { roomSlug, messageId, text, forceFail } = input;
	trySocketSend({ event: 'community:message:update', roomSlug, messageId, text });
	if (forceFail) {
		emitLocal({
			event: 'community:message:update',
			roomSlug,
			messageId,
			error: 'MESSAGE_UPDATE_FAILED',
		});
		return;
	}
	scheduleRoomTask(
		roomSlug,
		() => {
			const store = ensureStore(roomSlug);
			const target = store.messages.find((m) => m.id === messageId);
			if (!target) return;
			target.text = text;
			target.edited = true;
			target.updatedAt = new Date().toISOString();
			emitLocal({
				event: 'community:message:updated',
				roomSlug,
				message: { ...target },
			});
		},
		220,
	);
};

export const deleteCommunityMessage = (input: {
	roomSlug: string;
	messageId: string;
	forceFail?: boolean;
}) => {
	const { roomSlug, messageId, forceFail } = input;
	trySocketSend({ event: 'community:message:delete', roomSlug, messageId });
	if (forceFail) {
		emitLocal({
			event: 'community:message:delete',
			roomSlug,
			messageId,
			error: 'MESSAGE_DELETE_FAILED',
		});
		return;
	}
	scheduleRoomTask(
		roomSlug,
		() => {
			const store = ensureStore(roomSlug);
			const target = store.messages.find((m) => m.id === messageId);
			if (!target) return;
			target.deleted = true;
			target.text = '';
			emitLocal({
				event: 'community:message:deleted',
				roomSlug,
				messageId,
				message: { ...target },
			});
		},
		180,
	);
};

export const toggleCommunityReaction = (input: {
	roomSlug: string;
	messageId: string;
	emoji: CommunityReactionEmoji;
	memberId: string;
}) => {
	const { roomSlug, messageId, emoji } = input;
	trySocketSend({ event: 'community:reaction:toggle', ...input });
	scheduleRoomTask(
		roomSlug,
		() => {
			const store = ensureStore(roomSlug);
			const target = store.messages.find((m) => m.id === messageId);
			if (!target) return;
			const existing = target.reactions.find((r) => r.emoji === emoji);
			if (existing) {
				if (existing.reactedByMe) {
					existing.reactedByMe = false;
					existing.count = Math.max(0, existing.count - 1);
					if (existing.count === 0) {
						target.reactions = target.reactions.filter((r) => r.emoji !== emoji);
					}
				} else {
					existing.reactedByMe = true;
					existing.count += 1;
				}
			} else {
				target.reactions = [...target.reactions, { emoji, count: 1, reactedByMe: true }];
			}
			emitLocal({
				event: 'community:reaction:updated',
				roomSlug,
				message: { ...target, reactions: [...target.reactions] },
			});
		},
		120,
	);
};

export const emitTyping = (roomSlug: string, typing: CommunityTypingUser, active: boolean) => {
	trySocketSend({
		event: active ? 'community:typing:start' : 'community:typing:stop',
		roomSlug,
		typing,
	});
	emitLocal({
		event: active ? 'community:typing:start' : 'community:typing:stop',
		roomSlug,
		typing,
	});
};

export const markMessageStatus = (
	message: CommunityRoomMessage,
	status: CommunityMessageStatus,
): CommunityRoomMessage => ({ ...message, status });
