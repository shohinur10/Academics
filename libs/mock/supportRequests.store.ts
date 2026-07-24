import { makeVar } from '@apollo/client';
import {
	SUPPORT_STATUS_LABELS,
	SUPPORT_TIMELINE_LABELS,
	SUPPORT_TIMELINE_ORDER,
	SupportTicketDetail,
	SupportTicketMessage,
	SupportTicketStatus,
	SupportTimelineEvent,
	SupportTimelineStepId,
} from '../types/support/request';
import { SupportTicketAttachmentMeta } from '../types/support/contact';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const statusIndex = (status: SupportTicketStatus) => SUPPORT_TIMELINE_ORDER.indexOf(status);

export const buildTimeline = (
	status: SupportTicketStatus,
	stamps: Partial<Record<SupportTimelineStepId, string | null>>,
): SupportTimelineEvent[] => {
	const currentIdx = statusIndex(status);
	return SUPPORT_TIMELINE_ORDER.map((id, index) => ({
		id,
		label: SUPPORT_TIMELINE_LABELS[id],
		at: stamps[id] ?? null,
		completed: index <= currentIdx && Boolean(stamps[id] || index < currentIdx),
		current: index === currentIdx,
	})).map((step, index) => {
		if (index < currentIdx && !step.at) {
			return { ...step, completed: true };
		}
		if (index === currentIdx) {
			return { ...step, completed: true, current: true, at: step.at ?? stamps.created ?? null };
		}
		return { ...step, completed: false, current: false };
	});
};

const capsFor = (status: SupportTicketStatus) => ({
	canReply: status !== 'closed',
	canClose: status !== 'closed',
	canReopen: status === 'resolved' || status === 'closed',
});

const seedTickets = (): SupportTicketDetail[] => {
	const t1Created = '2026-07-18T09:12:00.000Z';
	const t1Assigned = '2026-07-18T10:05:00.000Z';
	const t1Progress = '2026-07-18T11:20:00.000Z';
	const t1Waiting = '2026-07-19T08:40:00.000Z';

	const t2Created = '2026-07-10T14:00:00.000Z';
	const t2Assigned = '2026-07-10T15:10:00.000Z';
	const t2Progress = '2026-07-11T09:00:00.000Z';
	const t2Resolved = '2026-07-12T16:30:00.000Z';

	const t3Created = '2026-07-21T07:30:00.000Z';

	const tickets: SupportTicketDetail[] = [
		{
			id: 'req-1001',
			subject: 'Cannot access enrolled IELTS Writing course',
			category: 'courses',
			priority: 'high',
			status: 'waiting',
			relatedCourseId: 'course-2',
			relatedCourseTitle: 'IELTS Writing Band 7+ Masterclass',
			createdAt: t1Created,
			updatedAt: t1Waiting,
			assigneeName: 'Mina Park',
			...capsFor('waiting'),
			attachments: [
				{
					name: 'enrollment-screenshot.png',
					mimeType: 'image/png',
					size: 245_760,
					url: '/img/banner/header1.svg',
				},
			],
			messages: [
				{
					id: 'msg-1001-1',
					ticketId: 'req-1001',
					author: {
						id: 'user-1',
						name: 'You',
						role: 'user',
						avatar: '/img/profile/defaultUser.svg',
					},
					body: 'I enrolled yesterday but My Courses still shows the class as locked. Order ID ORD-88421.',
					createdAt: t1Created,
					attachments: [
						{
							name: 'enrollment-screenshot.png',
							mimeType: 'image/png',
							size: 245_760,
							url: '/img/banner/header1.svg',
						},
					],
				},
				{
					id: 'msg-1001-2',
					ticketId: 'req-1001',
					author: {
						id: 'agent-1',
						name: 'Mina Park',
						role: 'support',
						avatar: '/img/profile/defaultUser.svg',
					},
					body: 'Thanks for the details. I can see the payment cleared. Please try signing out and back in, then refresh My Courses. Reply here if it is still locked.',
					createdAt: t1Progress,
					attachments: [],
				},
				{
					id: 'msg-1001-3',
					ticketId: 'req-1001',
					author: {
						id: 'agent-1',
						name: 'Mina Park',
						role: 'support',
						avatar: '/img/profile/defaultUser.svg',
					},
					body: 'We are waiting on your confirmation after the refresh. If access is still blocked, share a new screenshot of My Courses.',
					createdAt: t1Waiting,
					attachments: [],
				},
			],
			timeline: buildTimeline('waiting', {
				created: t1Created,
				assigned: t1Assigned,
				in_progress: t1Progress,
				waiting: t1Waiting,
			}),
		},
		{
			id: 'req-1002',
			subject: 'Refund request for Speaking Foundations',
			category: 'payments',
			priority: 'normal',
			status: 'resolved',
			relatedCourseId: 'course-1',
			relatedCourseTitle: 'English Speaking Foundations',
			createdAt: t2Created,
			updatedAt: t2Resolved,
			assigneeName: 'Jordan Lee',
			...capsFor('resolved'),
			attachments: [],
			messages: [
				{
					id: 'msg-1002-1',
					ticketId: 'req-1002',
					author: {
						id: 'user-1',
						name: 'You',
						role: 'user',
						avatar: '/img/profile/defaultUser.svg',
					},
					body: 'I completed under 20% and would like a refund within the 7-day window. Order ORD-77109.',
					createdAt: t2Created,
					attachments: [],
				},
				{
					id: 'msg-1002-2',
					ticketId: 'req-1002',
					author: {
						id: 'agent-2',
						name: 'Jordan Lee',
						role: 'support',
						avatar: '/img/profile/defaultUser.svg',
					},
					body: 'Your refund is approved. It should return to the original payment method in 5–10 business days.',
					createdAt: t2Resolved,
					attachments: [],
				},
			],
			timeline: buildTimeline('resolved', {
				created: t2Created,
				assigned: t2Assigned,
				in_progress: t2Progress,
				resolved: t2Resolved,
			}),
		},
		{
			id: 'req-1003',
			subject: 'Certificate name spelling correction',
			category: 'certificates',
			priority: 'low',
			status: 'created',
			createdAt: t3Created,
			updatedAt: t3Created,
			...capsFor('created'),
			attachments: [
				{
					name: 'id-scan.pdf',
					mimeType: 'application/pdf',
					size: 120_000,
				},
			],
			messages: [
				{
					id: 'msg-1003-1',
					ticketId: 'req-1003',
					author: {
						id: 'user-1',
						name: 'You',
						role: 'user',
						avatar: '/img/profile/defaultUser.svg',
					},
					body: 'My certificate shows an incorrect middle name. Please help me re-issue it.',
					createdAt: t3Created,
					attachments: [
						{
							name: 'id-scan.pdf',
							mimeType: 'application/pdf',
							size: 120_000,
						},
					],
				},
			],
			timeline: buildTimeline('created', { created: t3Created }),
		},
	];

	return tickets;
};

let tickets: SupportTicketDetail[] = seedTickets();

export const supportTicketsRevisionVar = makeVar(0);

const bump = () => supportTicketsRevisionVar(supportTicketsRevisionVar() + 1);

export const listSupportTickets = (): SupportTicketDetail[] => clone(tickets);

export const getSupportTicketFromStore = (id: string): SupportTicketDetail | null => {
	const found = tickets.find((ticket) => ticket.id === id);
	return found ? clone(found) : null;
};

export const resetSupportTicketsStore = () => {
	tickets = seedTickets();
	bump();
};

const refreshDerived = (ticket: SupportTicketDetail): SupportTicketDetail => {
	const stamps: Partial<Record<SupportTimelineStepId, string | null>> = {};
	ticket.timeline.forEach((step) => {
		stamps[step.id] = step.at;
	});
	stamps[ticket.status] = stamps[ticket.status] || ticket.updatedAt;
	stamps.created = stamps.created || ticket.createdAt;

	const caps = capsFor(ticket.status);
	const attachmentsMap = new Map<string, SupportTicketAttachmentMeta>();
	ticket.messages.forEach((message) => {
		message.attachments.forEach((file) => {
			attachmentsMap.set(`${file.name}-${file.size}`, file);
		});
	});

	return {
		...ticket,
		...caps,
		attachments: Array.from(attachmentsMap.values()),
		timeline: buildTimeline(ticket.status, stamps),
	};
};

export const appendTicketReply = (
	ticketId: string,
	body: string,
	attachments: SupportTicketAttachmentMeta[] = [],
): SupportTicketDetail | null => {
	const index = tickets.findIndex((ticket) => ticket.id === ticketId);
	if (index < 0) return null;
	const ticket = clone(tickets[index]);
	if (!ticket.canReply) return null;

	const now = new Date().toISOString();
	const message: SupportTicketMessage = {
		id: `msg-${Date.now()}`,
		ticketId,
		author: {
			id: 'user-1',
			name: 'You',
			role: 'user',
			avatar: '/img/profile/defaultUser.svg',
		},
		body: body.trim(),
		createdAt: now,
		attachments,
	};

	ticket.messages.push(message);
	ticket.updatedAt = now;
	if (ticket.status === 'waiting' || ticket.status === 'resolved') {
		ticket.status = 'in_progress';
	} else if (ticket.status === 'created') {
		ticket.status = 'assigned';
	}

	const next = refreshDerived(ticket);
	tickets[index] = next;
	bump();
	return clone(next);
};

export const closeTicketInStore = (ticketId: string): SupportTicketDetail | null => {
	const index = tickets.findIndex((ticket) => ticket.id === ticketId);
	if (index < 0) return null;
	const ticket = clone(tickets[index]);
	if (ticket.status === 'closed') return null;

	const now = new Date().toISOString();
	ticket.status = 'closed';
	ticket.updatedAt = now;
	ticket.messages.push({
		id: `msg-${Date.now()}`,
		ticketId,
		author: { id: 'system', name: 'System', role: 'system' },
		body: 'Ticket closed by the requester.',
		createdAt: now,
		attachments: [],
	});

	const next = refreshDerived(ticket);
	tickets[index] = next;
	bump();
	return clone(next);
};

export const reopenTicketInStore = (ticketId: string): SupportTicketDetail | null => {
	const index = tickets.findIndex((ticket) => ticket.id === ticketId);
	if (index < 0) return null;
	const ticket = clone(tickets[index]);
	if (!ticket.canReopen) return null;

	const now = new Date().toISOString();
	ticket.status = 'in_progress';
	ticket.updatedAt = now;
	ticket.messages.push({
		id: `msg-${Date.now()}`,
		ticketId,
		author: { id: 'system', name: 'System', role: 'system' },
		body: 'Ticket reopened by the requester.',
		createdAt: now,
		attachments: [],
	});

	const next = refreshDerived(ticket);
	tickets[index] = next;
	bump();
	return clone(next);
};

export const createTicketInStore = (input: {
	category: SupportTicketDetail['category'];
	subject: string;
	priority: SupportTicketDetail['priority'];
	description: string;
	relatedCourseId?: string;
	relatedCourseTitle?: string;
	attachment?: SupportTicketAttachmentMeta | null;
}): SupportTicketDetail => {
	const now = new Date().toISOString();
	const id = `req-${Date.now().toString().slice(-6)}`;
	const attachments = input.attachment ? [input.attachment] : [];
	const ticket: SupportTicketDetail = {
		id,
		subject: input.subject.trim(),
		category: input.category,
		priority: input.priority,
		status: 'created',
		relatedCourseId: input.relatedCourseId || undefined,
		relatedCourseTitle: input.relatedCourseTitle || undefined,
		createdAt: now,
		updatedAt: now,
		...capsFor('created'),
		attachments,
		messages: [
			{
				id: `msg-${Date.now()}`,
				ticketId: id,
				author: {
					id: 'user-1',
					name: 'You',
					role: 'user',
					avatar: '/img/profile/defaultUser.svg',
				},
				body: input.description.trim(),
				createdAt: now,
				attachments,
			},
		],
		timeline: buildTimeline('created', { created: now }),
	};

	const next = refreshDerived(ticket);
	tickets = [next, ...tickets];
	bump();
	return clone(next);
};

export const statusLabel = (status: SupportTicketStatus) => SUPPORT_STATUS_LABELS[status];
