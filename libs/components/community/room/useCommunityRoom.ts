import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../../apollo/store';
import { MemberType } from '../../../enums/member.enum';
import {
	CommunityMessageStatus,
	CommunityReactionEmoji,
	CommunityRoomMember,
	CommunityRoomMessage,
	CommunityRoomRole,
	CommunityTypingUser,
} from '../../../types/community/room';
import {
	createCommunityMessage,
	deleteCommunityMessage,
	emitTyping,
	joinCommunityRoom,
	leaveCommunityRoom,
	loadOlderMessages,
	subscribeCommunityRoom,
	toggleCommunityReaction,
	updateCommunityMessage,
} from './communityRoomChannel';
import { getCommunityRoomDetails } from '../../../mock/communityRooms.mock';
import { REACT_APP_API_URL } from '../../../config';

const mapMemberTypeToRole = (memberType?: string): CommunityRoomRole => {
	if (memberType === MemberType.ADMIN) return 'ADMIN';
	if (memberType === MemberType.INSTRUCTOR) return 'INSTRUCTOR';
	return 'STUDENT';
};

const resolveAvatar = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const mergeById = (current: CommunityRoomMessage[], incoming: CommunityRoomMessage[]) => {
	const map = new Map<string, CommunityRoomMessage>();
	current.forEach((msg) => map.set(msg.clientId || msg.id, msg));
	incoming.forEach((msg) => {
		const key = msg.clientId || msg.id;
		const existing = map.get(key);
		if (existing?.clientId && msg.id && existing.status === 'pending') {
			map.delete(existing.clientId);
			map.set(msg.id, { ...msg, status: 'sent' });
			return;
		}
		map.set(msg.id, msg);
		if (msg.clientId) map.set(msg.clientId, msg);
	});
	const deduped = new Map<string, CommunityRoomMessage>();
	Array.from(map.values()).forEach((msg) => {
		if (msg.deleted) return;
		deduped.set(msg.id, msg);
	});
	return Array.from(deduped.values()).sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);
};

export const useCommunityRoom = (slug: string | undefined) => {
	const user = useReactiveVar(userVar);
	const [messages, setMessages] = useState<CommunityRoomMessage[]>([]);
	const [typingUsers, setTypingUsers] = useState<CommunityTypingUser[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [loadingOlder, setLoadingOlder] = useState(false);
	const [muted, setMuted] = useState(false);
	const [threadParentId, setThreadParentId] = useState<string | null>(null);
	const [onlineCount, setOnlineCount] = useState<number | null>(null);
	const joinedRef = useRef<string | null>(null);
	const mutedRef = useRef(false);

	useEffect(() => {
		mutedRef.current = muted;
	}, [muted]);

	const room = useMemo(() => (slug ? getCommunityRoomDetails(slug) : null), [slug]);

	const selfMember: CommunityRoomMember | null = useMemo(() => {
		if (!user?._id) return null;
		return {
			id: user._id,
			name: user.memberNick || 'You',
			avatar: resolveAvatar(user.memberImage),
			role: mapMemberTypeToRole(user.memberType),
			verified: user.memberType === MemberType.INSTRUCTOR,
			online: true,
		};
	}, [user]);

	const canModerate = selfMember?.role === 'ADMIN' || selfMember?.role === 'MODERATOR';
	const canCreateRoom = selfMember?.role === 'ADMIN' || selfMember?.role === 'INSTRUCTOR';

	useEffect(() => {
		if (!slug) return;
		joinCommunityRoom(slug, selfMember);
		joinedRef.current = slug;
		return () => {
			leaveCommunityRoom(slug);
			joinedRef.current = null;
		};
	}, [slug, selfMember?.id]);

	useEffect(() => {
		if (!slug) return;
		return subscribeCommunityRoom((payload) => {
			if (payload.roomSlug !== slug) return;

			switch (payload.event) {
				case 'community:messages:page':
					if (payload.messages) setMessages(payload.messages);
					setCursor(payload.cursor ?? null);
					setHasMore(Boolean(payload.hasMore));
					break;
				case 'community:message:created':
					if (!payload.message) break;
					setMessages((prev) => {
						const withoutPending = prev.filter(
							(m) => !(payload.clientId && (m.clientId === payload.clientId || m.id === payload.clientId)),
						);
						return mergeById(withoutPending, [payload.message!]);
					});
					break;
				case 'community:message:updated':
					if (!payload.message) break;
					setMessages((prev) => prev.map((m) => (m.id === payload.message!.id ? payload.message! : m)));
					break;
				case 'community:message:deleted':
					setMessages((prev) => prev.filter((m) => m.id !== payload.messageId && m.id !== payload.message?.id));
					break;
				case 'community:reaction:updated':
					if (!payload.message) break;
					setMessages((prev) => prev.map((m) => (m.id === payload.message!.id ? payload.message! : m)));
					break;
				case 'community:typing:start':
					if (mutedRef.current) break;
					if (!payload.typing || payload.typing.id === selfMember?.id) break;
					setTypingUsers((prev) =>
						prev.some((u) => u.id === payload.typing!.id) ? prev : [...prev, payload.typing!],
					);
					break;
				case 'community:typing:stop':
					if (!payload.typing) break;
					setTypingUsers((prev) => prev.filter((u) => u.id !== payload.typing!.id));
					break;
				case 'community:presence:updated':
					if (typeof payload.membersOnline === 'number') setOnlineCount(payload.membersOnline);
					break;
				case 'community:message:create':
					if (payload.error && payload.clientId) {
						setMessages((prev) =>
							prev.map((m) =>
								m.clientId === payload.clientId || m.id === payload.clientId
									? { ...m, status: 'failed' as CommunityMessageStatus }
									: m,
							),
						);
					}
					break;
				default:
					break;
			}
		});
	}, [slug, selfMember?.id]);

	const sendMessage = useCallback(
		async (text: string, options?: { forceFail?: boolean; parentId?: string | null }) => {
			const trimmed = text.trim();
			if (!slug || !trimmed) return { ok: false as const, reason: 'empty' as const };
			if (!selfMember) return { ok: false as const, reason: 'auth' as const };

			const clientId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			const optimistic: CommunityRoomMessage = {
				id: clientId,
				clientId,
				roomSlug: slug,
				author: selfMember,
				text: trimmed,
				createdAt: new Date().toISOString(),
				replyCount: 0,
				parentId: options?.parentId ?? null,
				reactions: [],
				status: 'pending',
			};
			setMessages((prev) => [...prev, optimistic]);
			const result = createCommunityMessage({
				roomSlug: slug,
				clientId,
				text: trimmed,
				author: selfMember,
				parentId: options?.parentId ?? null,
				forceFail: options?.forceFail,
			});
			if (!result.ok) {
				setMessages((prev) =>
					prev.map((m) =>
						m.clientId === clientId ? { ...m, status: 'failed' as CommunityMessageStatus } : m,
					),
				);
				return { ok: false as const, reason: result.error === 'RATE_LIMITED' ? ('rate' as const) : ('failed' as const) };
			}
			return { ok: true as const, clientId };
		},
		[slug, selfMember],
	);

	const retryMessage = useCallback(
		(message: CommunityRoomMessage) => {
			if (!slug || !selfMember) return;
			setMessages((prev) =>
				prev.map((m) => (m.id === message.id ? { ...m, status: 'pending' } : m)),
			);
			createCommunityMessage({
				roomSlug: slug,
				clientId: message.clientId || message.id,
				text: message.text,
				author: selfMember,
				parentId: message.parentId,
			});
		},
		[slug, selfMember],
	);

	const editMessage = useCallback(
		(messageId: string, text: string) => {
			if (!slug) return;
			const trimmed = text.trim();
			if (!trimmed) return;
			setMessages((prev) =>
				prev.map((m) =>
					m.id === messageId ? { ...m, text: trimmed, edited: true, status: 'pending' } : m,
				),
			);
			updateCommunityMessage({ roomSlug: slug, messageId, text: trimmed });
		},
		[slug],
	);

	const removeMessage = useCallback(
		(messageId: string) => {
			if (!slug) return;
			setMessages((prev) => prev.filter((m) => m.id !== messageId));
			deleteCommunityMessage({ roomSlug: slug, messageId });
		},
		[slug],
	);

	const reactToMessage = useCallback(
		(messageId: string, emoji: CommunityReactionEmoji) => {
			if (!slug || !selfMember) return;
			setMessages((prev) =>
				prev.map((m) => {
					if (m.id !== messageId) return m;
					const reactions = [...m.reactions];
					const idx = reactions.findIndex((r) => r.emoji === emoji);
					if (idx >= 0) {
						const current = reactions[idx];
						if (current.reactedByMe) {
							const count = current.count - 1;
							if (count <= 0) reactions.splice(idx, 1);
							else reactions[idx] = { ...current, count, reactedByMe: false };
						} else {
							reactions[idx] = { ...current, count: current.count + 1, reactedByMe: true };
						}
					} else {
						reactions.push({ emoji, count: 1, reactedByMe: true });
					}
					return { ...m, reactions };
				}),
			);
			toggleCommunityReaction({
				roomSlug: slug,
				messageId,
				emoji,
				memberId: selfMember.id,
			});
		},
		[slug, selfMember],
	);

	const loadPrevious = useCallback(async () => {
		if (!slug || !hasMore || loadingOlder) return;
		setLoadingOlder(true);
		const page = loadOlderMessages(slug, cursor);
		setMessages((prev) => mergeById(page.messages, prev));
		setCursor(page.cursor);
		setHasMore(page.hasMore);
		setLoadingOlder(false);
	}, [slug, hasMore, loadingOlder, cursor]);

	const notifyTyping = useCallback(
		(active: boolean) => {
			if (!slug || !selfMember || mutedRef.current) return;
			emitTyping(slug, { id: selfMember.id, name: selfMember.name }, active);
		},
		[slug, selfMember],
	);

	const threadParent = messages.find((m) => m.id === threadParentId) ?? null;
	const threadReplies = messages.filter((m) => m.parentId === threadParentId);

	const roomWithPresence = useMemo(() => {
		if (!room) return null;
		if (onlineCount == null) return room;
		return { ...room, onlineCount };
	}, [room, onlineCount]);

	return {
		room: roomWithPresence,
		messages: messages.filter((m) => !m.parentId),
		allMessages: messages,
		typingUsers: muted ? [] : typingUsers,
		selfMember,
		canModerate,
		canCreateRoom,
		muted,
		setMuted,
		hasMore,
		loadingOlder,
		sendMessage,
		retryMessage,
		editMessage,
		removeMessage,
		reactToMessage,
		loadPrevious,
		notifyTyping,
		threadParentId,
		setThreadParentId,
		threadParent,
		threadReplies,
	};
};
