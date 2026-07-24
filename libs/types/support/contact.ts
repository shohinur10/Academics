/** Contact Support / ticket form types. */

export type SupportTicketCategory =
	| 'account'
	| 'courses'
	| 'payments'
	| 'certificates'
	| 'technical'
	| 'instructor'
	| 'community'
	| 'other';

export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface SupportTicketCategoryOption {
	id: SupportTicketCategory;
	label: string;
}

export interface SupportTicketPriorityOption {
	id: SupportTicketPriority;
	label: string;
	eta: string;
}

export interface SupportTicketAttachmentMeta {
	name: string;
	mimeType: string;
	size: number;
	/** Remote URL when imageUploader (or ticket API) succeeds. */
	url?: string;
}

export interface SupportTicketInput {
	category: SupportTicketCategory | '';
	subject: string;
	relatedCourseId: string;
	relatedCourseTitle: string;
	priority: SupportTicketPriority | '';
	description: string;
	attachment: SupportTicketAttachmentMeta | null;
	channel?: string;
}

export interface SupportTicketFieldErrors {
	category?: string;
	subject?: string;
	priority?: string;
	description?: string;
	attachment?: string;
}

export type SupportTicketSubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export type SupportTicketErrorCode =
	| 'VALIDATION'
	| 'UPLOAD_FAILED'
	| 'UNAUTHORIZED'
	| 'API_UNAVAILABLE'
	| 'NETWORK'
	| 'UNKNOWN';

export interface SupportTicketResult {
	ok: boolean;
	code?: SupportTicketErrorCode;
	message: string;
	ticketId?: string;
	fieldErrors?: SupportTicketFieldErrors;
}

export const SUPPORT_TICKET_CATEGORIES: SupportTicketCategoryOption[] = [
	{ id: 'account', label: 'Account & Login' },
	{ id: 'courses', label: 'Courses & Enrollment' },
	{ id: 'payments', label: 'Payments & Refunds' },
	{ id: 'certificates', label: 'Certificates' },
	{ id: 'technical', label: 'Technical Problems' },
	{ id: 'instructor', label: 'Instructor' },
	{ id: 'community', label: 'Community & Safety' },
	{ id: 'other', label: 'Other' },
];

export const SUPPORT_TICKET_PRIORITIES: SupportTicketPriorityOption[] = [
	{ id: 'low', label: 'Low', eta: 'Within 48 hours' },
	{ id: 'normal', label: 'Normal', eta: 'Within 24 hours' },
	{ id: 'high', label: 'High', eta: 'Within 8 hours' },
	{ id: 'urgent', label: 'Urgent', eta: 'Within 2 hours' },
];

export const SUPPORT_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const SUPPORT_SAFE_ATTACHMENT_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'application/pdf',
] as const;

export const emptySupportTicketInput = (): SupportTicketInput => ({
	category: '',
	subject: '',
	relatedCourseId: '',
	relatedCourseTitle: '',
	priority: 'normal',
	description: '',
	attachment: null,
	channel: 'request',
});

export const estimatedResponseFor = (priority: SupportTicketPriority | ''): string => {
	const match = SUPPORT_TICKET_PRIORITIES.find((item) => item.id === priority);
	return match?.eta ?? 'Within 24 hours';
};
