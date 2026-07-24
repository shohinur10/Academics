import axios from 'axios';
import { getJwtToken } from '../auth';
import { REACT_APP_API_URL } from '../config';
import {
	SUPPORT_MAX_ATTACHMENT_BYTES,
	SUPPORT_SAFE_ATTACHMENT_TYPES,
	SupportTicketAttachmentMeta,
	SupportTicketCategory,
	SupportTicketFieldErrors,
	SupportTicketInput,
	SupportTicketPriority,
	SupportTicketResult,
} from '../types/support/contact';
import { createTicketInStore } from '../mock/supportRequests.store';

const isSafeType = (mime: string) =>
	(SUPPORT_SAFE_ATTACHMENT_TYPES as readonly string[]).includes(mime);

export const validateSupportTicket = (input: SupportTicketInput): SupportTicketFieldErrors => {
	const errors: SupportTicketFieldErrors = {};

	if (!input.category) errors.category = 'Category is required.';
	if (!input.subject.trim()) errors.subject = 'Subject is required.';
	else if (input.subject.trim().length < 4) errors.subject = 'Subject must be at least 4 characters.';
	if (!input.priority) errors.priority = 'Priority is required.';
	if (!input.description.trim()) errors.description = 'Description is required.';
	else if (input.description.trim().length < 20) {
		errors.description = 'Please provide at least 20 characters so we can help faster.';
	}

	return errors;
};

export const validateSupportAttachmentFile = (file: File): string | null => {
	if (!isSafeType(file.type)) {
		return 'Only JPG, PNG, WEBP, GIF, or PDF files are allowed.';
	}
	if (file.size > SUPPORT_MAX_ATTACHMENT_BYTES) {
		return 'Attachment must be 10MB or smaller.';
	}
	return null;
};

/**
 * Upload support attachment via existing GraphQL `imageUploader` when possible.
 * Non-image files are accepted as local metadata only until the ticket API accepts uploads.
 */
export const uploadSupportAttachment = async (file: File): Promise<SupportTicketAttachmentMeta> => {
	const typeError = validateSupportAttachmentFile(file);
	if (typeError) {
		throw Object.assign(new Error(typeError), { code: 'VALIDATION' as const });
	}

	const meta: SupportTicketAttachmentMeta = {
		name: file.name,
		mimeType: file.type || 'application/octet-stream',
		size: file.size,
	};

	const isImage = meta.mimeType.startsWith('image/');
	if (!isImage) {
		return meta;
	}

	const token = getJwtToken();
	const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL;

	if (!token || !graphqlUrl) {
		return meta;
	}

	const formData = new FormData();
	formData.append(
		'operations',
		JSON.stringify({
			query: `mutation ImageUploader($file: Upload!, $target: String!) {
				imageUploader(file: $file, target: $target)
			}`,
			variables: { file: null, target: 'member' },
		}),
	);
	formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
	formData.append('0', file);

	try {
		const response = await axios.post(graphqlUrl, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'apollo-require-preflight': true,
				Authorization: `Bearer ${token}`,
			},
		});

		const path = response.data?.data?.imageUploader;
		if (!path) {
			return meta;
		}

		return {
			...meta,
			url: path.startsWith('http') ? path : `${REACT_APP_API_URL}/${path}`,
		};
	} catch {
		return meta;
	}
};

const CREATE_SUPPORT_TICKET_MUTATION = `
	mutation CreateSupportTicket($input: SupportTicketInput!) {
		createSupportTicket(input: $input) {
			_id
			status
		}
	}
`;

const isUnavailableMutationError = (message: string) => {
	const lower = message.toLowerCase();
	return (
		lower.includes('cannot query field') ||
		lower.includes('unknown type') ||
		lower.includes('unknown field') ||
		lower.includes('createsupportticket') ||
		lower.includes('supportticketinput')
	);
};

const createLocalTicket = (input: SupportTicketInput): SupportTicketResult => {
	const ticket = createTicketInStore({
		category: input.category as SupportTicketCategory,
		subject: input.subject,
		priority: input.priority as SupportTicketPriority,
		description: input.description,
		relatedCourseId: input.relatedCourseId || undefined,
		relatedCourseTitle: input.relatedCourseTitle || undefined,
		attachment: input.attachment,
	});

	return {
		ok: true,
		message:
			'Your support request was saved locally. It will sync when createSupportTicket is available on the server.',
		ticketId: ticket.id,
	};
};

/**
 * Isolated support-ticket submission.
 * Prefers GraphQL `createSupportTicket`; falls back to the isolated request store
 * when the mutation is missing (same pattern as reply/close/reopen).
 */
export const submitSupportTicket = async (input: SupportTicketInput): Promise<SupportTicketResult> => {
	const fieldErrors = validateSupportTicket(input);
	if (Object.keys(fieldErrors).length) {
		return {
			ok: false,
			code: 'VALIDATION',
			message: 'Please fix the highlighted fields.',
			fieldErrors,
		};
	}

	const token = getJwtToken();
	const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL;

	if (!graphqlUrl || !token) {
		return createLocalTicket(input);
	}

	const payload = {
		category: input.category,
		subject: input.subject.trim(),
		relatedCourseId: input.relatedCourseId || null,
		relatedCourseTitle: input.relatedCourseTitle || null,
		priority: input.priority,
		description: input.description.trim(),
		attachmentUrl: input.attachment?.url ?? null,
		attachmentName: input.attachment?.name ?? null,
		channel: input.channel || 'request',
	};

	try {
		const response = await axios.post(
			graphqlUrl,
			{
				query: CREATE_SUPPORT_TICKET_MUTATION,
				variables: { input: payload },
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		);

		const gqlErrors = response.data?.errors as { message?: string }[] | undefined;
		if (gqlErrors?.length) {
			const message = gqlErrors.map((err) => err.message).filter(Boolean).join(' ') || 'Request failed.';
			if (isUnavailableMutationError(message)) {
				return createLocalTicket(input);
			}
			return {
				ok: false,
				code: 'UNKNOWN',
				message,
			};
		}

		const ticketId = response.data?.data?.createSupportTicket?._id as string | undefined;
		if (!ticketId) {
			return createLocalTicket(input);
		}

		return {
			ok: true,
			message: 'Your support request was submitted.',
			ticketId,
		};
	} catch (error: unknown) {
		const axiosError = error as {
			response?: { data?: { errors?: { message?: string }[] } };
			message?: string;
		};
		const gqlMessage = axiosError.response?.data?.errors?.[0]?.message;
		if (gqlMessage && isUnavailableMutationError(gqlMessage)) {
			return createLocalTicket(input);
		}
		if (!axiosError.response) {
			return createLocalTicket(input);
		}
		return {
			ok: false,
			code: 'UNKNOWN',
			message: gqlMessage || axiosError.message || 'Something went wrong while submitting.',
		};
	}
};
