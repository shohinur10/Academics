import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { SupportTicketDetail } from '../../../types/support/request';
import { SUPPORT_TICKET_CATEGORIES, SUPPORT_TICKET_PRIORITIES } from '../../../types/support/contact';
import { statusLabel } from '../../../mock/supportRequests.store';
import StatusBadge from './StatusBadge';
import SupportCard from './SupportCard';

const statusTone = (status: SupportTicketDetail['status']) => {
	switch (status) {
		case 'waiting':
			return 'warning' as const;
		case 'resolved':
			return 'success' as const;
		case 'closed':
			return 'neutral' as const;
		case 'created':
			return 'info' as const;
		default:
			return 'purple' as const;
	}
};

interface RequestCardProps {
	ticket: SupportTicketDetail;
}

const RequestCard = ({ ticket }: RequestCardProps) => {
	const { t } = useTranslation('common');
	const category =
		SUPPORT_TICKET_CATEGORIES.find((item) => item.id === ticket.category)?.label ?? ticket.category;
	const priority =
		SUPPORT_TICKET_PRIORITIES.find((item) => item.id === ticket.priority)?.label ?? ticket.priority;

	return (
		<SupportCard
			className={'request-card'}
			href={`/support/requests/${ticket.id}`}
			title={t(ticket.subject)}
			excerpt={`${ticket.id} · ${t(category)}${
				ticket.relatedCourseTitle ? ` · ${t(ticket.relatedCourseTitle)}` : ''
			}`}
			badge={
				<>
					<StatusBadge label={t(statusLabel(ticket.status))} tone={statusTone(ticket.status)} />
					<StatusBadge label={t(priority)} tone={ticket.priority === 'urgent' || ticket.priority === 'high' ? 'danger' : 'neutral'} />
				</>
			}
			footer={
				<>
					<time dateTime={ticket.updatedAt}>
						{t('Updated')}{' '}
						{new Date(ticket.updatedAt).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})}
					</time>
					<Link href={`/support/requests/${ticket.id}`}>{t('View Details')}</Link>
				</>
			}
		/>
	);
};

export default RequestCard;
