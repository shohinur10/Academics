import axios from 'axios';
import { getJwtToken } from '../auth';
import {
	SupportTicketActionResult,
	SupportTicketDetail,
} from '../types/support/request';
import { SupportTicketAttachmentMeta } from '../types/support/contact';
import {
	appendTicketReply,
	closeTicketInStore,
	getSupportTicketFromStore,
	reopenTicketInStore,
} from '../mock/supportRequests.store';
import { uploadSupportAttachment, validateSupportAttachmentFile } from './submitSupportTicket';

export type TicketDataSource = 'api' | 'mock';

export interface FetchSupportTicketResult {
	ok: boolean;
	source?: TicketDataSource;
	ticket?: SupportTicketDetail;
	code?: 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK' | 'UNKNOWN';
	message?: string;
}

const GET_SUPPORT_TICKET_QUERY = `
	query GetSupportTicket($id: String!) {
		getSupportTicket(id: $id) {
			_id
			subject
			category
			priority
			status
			relatedCourseId
			relatedCourseTitle
			createdAt
			updatedAt
			assigneeName
			canReopen
			canClose
			canReply
			attachments { name mimeType size url }
			messages {
				_id
				body
				createdAt
				author { _id name role avatar }
				attachments { name mimeType size url }
			}
			timeline { id label at completed current }
		}
	}
`;

const isUnavailable = (message: string) => {
	const lower = message.toLowerCase();
	return (
		lower.includes('cannot query field') ||
		lower.includes('unknown type') ||
		lower.includes('unknown field') ||
		lower.includes('getsupportticket') ||
		lower.includes('createsupportticket') ||
		lower.includes('replysupportticket') ||
		lower.includes('closesupportticket') ||
		lower.includes('reopensupportticket')
	);
};

interface ApiTicketAttachment {
	name?: string;
	mimeType?: string;
	size?: number;
	url?: string;
}

interface ApiTicketMessage {
	_id?: string;
	body?: string;
	createdAt?: string;
	author?: { _id?: string; name?: string; role?: string; avatar?: string };
	attachments?: ApiTicketAttachment[];
}

interface ApiTicketPayload {
	_id?: string;
	subject?: string;
	category?: string;
	priority?: string;
	status?: string;
	relatedCourseId?: string;
	relatedCourseTitle?: string;
	createdAt?: string;
	updatedAt?: string;
	assigneeName?: string;
	canReopen?: boolean;
	canClose?: boolean;
	canReply?: boolean;
	attachments?: ApiTicketAttachment[];
	messages?: ApiTicketMessage[];
	timeline?: SupportTicketDetail['timeline'];
}

const mapApiTicket = (raw: ApiTicketPayload): SupportTicketDetail => ({
	id: raw._id ?? '',
	subject: raw.subject ?? '',
	category: (raw.category as SupportTicketDetail['category']) ?? 'other',
	priority: (raw.priority as SupportTicketDetail['priority']) ?? 'normal',
	status: (raw.status as SupportTicketDetail['status']) ?? 'created',
	relatedCourseId: raw.relatedCourseId ?? undefined,
	relatedCourseTitle: raw.relatedCourseTitle ?? undefined,
	createdAt: raw.createdAt ?? new Date().toISOString(),
	updatedAt: raw.updatedAt ?? new Date().toISOString(),
	assigneeName: raw.assigneeName ?? undefined,
	canReopen: Boolean(raw.canReopen),
	canClose: Boolean(raw.canClose),
	canReply: Boolean(raw.canReply),
	attachments: (raw.attachments ?? []).map((file) => ({
		name: file.name ?? 'file',
		mimeType: file.mimeType ?? 'application/octet-stream',
		size: file.size ?? 0,
		url: file.url,
	})),
	messages: (raw.messages ?? []).map((message, index) => ({
		id: message._id ?? `api-msg-${index}`,
		ticketId: raw._id ?? '',
		author: {
			id: message.author?._id ?? 'unknown',
			name: message.author?.name ?? 'Unknown',
			role: (message.author?.role as SupportTicketDetail['messages'][number]['author']['role']) ?? 'support',
			avatar: message.author?.avatar,
		},
		body: message.body ?? '',
		createdAt: message.createdAt ?? new Date().toISOString(),
		attachments: (message.attachments ?? []).map((file) => ({
			name: file.name ?? 'file',
			mimeType: file.mimeType ?? 'application/octet-stream',
			size: file.size ?? 0,
			url: file.url,
		})),
	})),
	timeline: raw.timeline ?? [],
});

/**
 * Isolated ticket loader — prefers GraphQL when available, otherwise mock store.
 * Does not invent API success for mutations that never ran.
 */
export const fetchSupportTicket = async (id: string): Promise<FetchSupportTicketResult> => {
	const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL;
	const token = getJwtToken();

	if (graphqlUrl && token) {
		try {
			const response = await axios.post(
				graphqlUrl,
				{ query: GET_SUPPORT_TICKET_QUERY, variables: { id } },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const gqlErrors = response.data?.errors as { message?: string }[] | undefined;
			if (gqlErrors?.length) {
				const message = gqlErrors.map((err) => err.message).filter(Boolean).join(' ');
				if (!isUnavailable(message)) {
					if (message.toLowerCase().includes('not found')) {
						return { ok: false, code: 'NOT_FOUND', message: 'Ticket not found.' };
					}
					return { ok: false, code: 'UNKNOWN', message };
				}
			} else if (response.data?.data?.getSupportTicket) {
				return {
					ok: true,
					source: 'api',
					ticket: mapApiTicket(response.data.data.getSupportTicket),
				};
			} else if (response.data?.data?.getSupportTicket === null) {
				return { ok: false, code: 'NOT_FOUND', message: 'Ticket not found.' };
			}
		} catch (error: unknown) {
			const axiosError = error as { response?: unknown; message?: string };
			if (axiosError.response) {
				return {
					ok: false,
					code: 'UNKNOWN',
					message: axiosError.message || 'Failed to load ticket.',
				};
			}
			/* fall through to mock when network/API is unreachable during local demo */
		}
	}

	await new Promise((resolve) => setTimeout(resolve, 280));
	const ticket = getSupportTicketFromStore(id);
	if (!ticket) {
		return { ok: false, code: 'NOT_FOUND', message: 'Ticket not found.' };
	}
	return { ok: true, source: 'mock', ticket };
};

const postTicketMutation = async (
	query: string,
	variables: Record<string, unknown>,
): Promise<{ ok: true; ticket: SupportTicketDetail } | { ok: false; unavailable: boolean; message: string }> => {
	const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL;
	const token = getJwtToken();
	if (!graphqlUrl || !token) {
		return { ok: false, unavailable: true, message: 'Support ticket API unavailable.' };
	}

	try {
		const response = await axios.post(
			graphqlUrl,
			{ query, variables },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		);
		const gqlErrors = response.data?.errors as { message?: string }[] | undefined;
		if (gqlErrors?.length) {
			const message = gqlErrors.map((err) => err.message).filter(Boolean).join(' ');
			return { ok: false, unavailable: isUnavailable(message), message };
		}
		const raw =
			response.data?.data?.replySupportTicket ||
			response.data?.data?.closeSupportTicket ||
			response.data?.data?.reopenSupportTicket;
		if (!raw) {
			return { ok: false, unavailable: true, message: 'Support ticket API unavailable.' };
		}
		return { ok: true, ticket: mapApiTicket(raw) };
	} catch (error: unknown) {
		const axiosError = error as { response?: unknown; message?: string };
		if (!axiosError.response) {
			return { ok: false, unavailable: true, message: 'Network error.' };
		}
		return { ok: false, unavailable: false, message: axiosError.message || 'Request failed.' };
	}
};

export const replyToSupportTicket = async (
	ticketId: string,
	body: string,
	file?: File | null,
): Promise<SupportTicketActionResult> => {
	const trimmed = body.trim();
	if (trimmed.length < 2) {
		return { ok: false, code: 'VALIDATION', message: 'Reply cannot be empty.' };
	}

	let attachments: SupportTicketAttachmentMeta[] = [];
	if (file) {
		const typeError = validateSupportAttachmentFile(file);
		if (typeError) return { ok: false, code: 'VALIDATION', message: typeError };
		try {
			attachments = [await uploadSupportAttachment(file)];
		} catch (error: unknown) {
			return {
				ok: false,
				code: 'API_UNAVAILABLE',
				message: error instanceof Error ? error.message : 'Attachment upload failed.',
			};
		}
	}

	const api = await postTicketMutation(
		`mutation ReplySupportTicket($input: SupportTicketReplyInput!) {
			replySupportTicket(input: $input) {
				_id subject category priority status relatedCourseId relatedCourseTitle
				createdAt updatedAt assigneeName canReopen canClose canReply
				attachments { name mimeType size url }
				messages { _id body createdAt author { _id name role avatar } attachments { name mimeType size url } }
				timeline { id label at completed current }
			}
		}`,
		{
			input: {
				ticketId,
				body: trimmed,
				attachmentUrl: attachments[0]?.url ?? null,
				attachmentName: attachments[0]?.name ?? null,
			},
		},
	);

	if (api.ok) return { ok: true, message: 'Reply sent.', ticket: api.ticket };
	if (!api.unavailable) return { ok: false, code: 'UNKNOWN', message: api.message };

	const ticket = appendTicketReply(ticketId, trimmed, attachments);
	if (!ticket) {
		return { ok: false, code: 'FORBIDDEN', message: 'Replies are not allowed on this ticket.' };
	}
	return {
		ok: true,
		message: 'Reply saved locally (ticket API unavailable).',
		ticket,
	};
};

export const closeSupportTicket = async (ticketId: string): Promise<SupportTicketActionResult> => {
	const api = await postTicketMutation(
		`mutation CloseSupportTicket($id: String!) {
			closeSupportTicket(id: $id) {
				_id subject category priority status relatedCourseId relatedCourseTitle
				createdAt updatedAt assigneeName canReopen canClose canReply
				attachments { name mimeType size url }
				messages { _id body createdAt author { _id name role avatar } attachments { name mimeType size url } }
				timeline { id label at completed current }
			}
		}`,
		{ id: ticketId },
	);

	if (api.ok) return { ok: true, message: 'Ticket closed.', ticket: api.ticket };
	if (!api.unavailable) return { ok: false, code: 'UNKNOWN', message: api.message };

	const ticket = closeTicketInStore(ticketId);
	if (!ticket) {
		return { ok: false, code: 'FORBIDDEN', message: 'This ticket cannot be closed.' };
	}
	return { ok: true, message: 'Ticket closed locally (ticket API unavailable).', ticket };
};

export const reopenSupportTicket = async (ticketId: string): Promise<SupportTicketActionResult> => {
	const api = await postTicketMutation(
		`mutation ReopenSupportTicket($id: String!) {
			reopenSupportTicket(id: $id) {
				_id subject category priority status relatedCourseId relatedCourseTitle
				createdAt updatedAt assigneeName canReopen canClose canReply
				attachments { name mimeType size url }
				messages { _id body createdAt author { _id name role avatar } attachments { name mimeType size url } }
				timeline { id label at completed current }
			}
		}`,
		{ id: ticketId },
	);

	if (api.ok) return { ok: true, message: 'Ticket reopened.', ticket: api.ticket };
	if (!api.unavailable) return { ok: false, code: 'UNKNOWN', message: api.message };

	const ticket = reopenTicketInStore(ticketId);
	if (!ticket) {
		return { ok: false, code: 'FORBIDDEN', message: 'This ticket cannot be reopened.' };
	}
	return { ok: true, message: 'Ticket reopened locally (ticket API unavailable).', ticket };
};
