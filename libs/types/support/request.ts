import {
	SupportTicketAttachmentMeta,
	SupportTicketCategory,
	SupportTicketPriority,
} from './contact';

/** Support request (ticket) detail types. */

export type SupportTicketStatus =
	| 'created'
	| 'assigned'
	| 'in_progress'
	| 'waiting'
	| 'resolved'
	| 'closed';

export type SupportMessageRole = 'user' | 'support' | 'system';

export type SupportTimelineStepId =
	| 'created'
	| 'assigned'
	| 'in_progress'
	| 'waiting'
	| 'resolved'
	| 'closed';

export interface SupportTicketActor {
	id: string;
	name: string;
	role: SupportMessageRole;
	avatar?: string;
}

export interface SupportTicketMessage {
	id: string;
	ticketId: string;
	author: SupportTicketActor;
	body: string;
	createdAt: string;
	attachments: SupportTicketAttachmentMeta[];
}

export interface SupportTimelineEvent {
	id: SupportTimelineStepId;
	label: string;
	at: string | null;
	completed: boolean;
	current: boolean;
}

export interface SupportTicketDetail {
	id: string;
	subject: string;
	category: SupportTicketCategory;
	priority: SupportTicketPriority;
	status: SupportTicketStatus;
	relatedCourseId?: string;
	relatedCourseTitle?: string;
	createdAt: string;
	updatedAt: string;
	assigneeName?: string;
	canReopen: boolean;
	canClose: boolean;
	canReply: boolean;
	attachments: SupportTicketAttachmentMeta[];
	messages: SupportTicketMessage[];
	timeline: SupportTimelineEvent[];
}

export type SupportTicketLoadState = 'loading' | 'ready' | 'error' | 'not_found';

export interface SupportTicketActionResult {
	ok: boolean;
	message: string;
	ticket?: SupportTicketDetail;
	code?: 'VALIDATION' | 'UNAUTHORIZED' | 'API_UNAVAILABLE' | 'NETWORK' | 'FORBIDDEN' | 'NOT_FOUND' | 'UNKNOWN';
}

export const SUPPORT_TIMELINE_ORDER: SupportTimelineStepId[] = [
	'created',
	'assigned',
	'in_progress',
	'waiting',
	'resolved',
	'closed',
];

export const SUPPORT_TIMELINE_LABELS: Record<SupportTimelineStepId, string> = {
	created: 'Created',
	assigned: 'Assigned',
	in_progress: 'In Progress',
	waiting: 'Waiting',
	resolved: 'Resolved',
	closed: 'Closed',
};

export const SUPPORT_STATUS_LABELS: Record<SupportTicketStatus, string> = {
	created: 'Created',
	assigned: 'Assigned',
	in_progress: 'In Progress',
	waiting: 'Waiting on you',
	resolved: 'Resolved',
	closed: 'Closed',
};
