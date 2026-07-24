import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { SUPPORT_TICKET_CATEGORIES, SUPPORT_TICKET_PRIORITIES } from '../../../types/support/contact';
import { SupportTicketDetail } from '../../../types/support/request';
import { statusLabel } from '../../../mock/supportRequests.store';
import StatusBadge from '../common/StatusBadge';

interface TicketHeaderProps {
	ticket: SupportTicketDetail;
	busy?: boolean;
	onClose: () => void;
	onReopen: () => void;
}

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

const TicketHeader = ({ ticket, busy = false, onClose, onReopen }: TicketHeaderProps) => {
	const { t } = useTranslation('common');
	const category =
		SUPPORT_TICKET_CATEGORIES.find((item) => item.id === ticket.category)?.label ?? ticket.category;
	const priority =
		SUPPORT_TICKET_PRIORITIES.find((item) => item.id === ticket.priority)?.label ?? ticket.priority;

	return (
		<header className={'ticket-header'}>
			<nav className={'ticket-breadcrumb'} aria-label={t('Breadcrumb')}>
				<Link href="/cs">{t('Help Center')}</Link>
				<span aria-hidden="true">/</span>
				<Link href="/support/requests">{t('My Support Requests')}</Link>
				<span aria-hidden="true">/</span>
				<span>{ticket.id}</span>
			</nav>

			<div className={'ticket-header-row'}>
				<div className={'ticket-header-copy'}>
					<p className={'ticket-id'}>{ticket.id}</p>
					<h1>{t(ticket.subject)}</h1>
					<div className={'ticket-chips'}>
						<StatusBadge label={t(statusLabel(ticket.status))} tone={statusTone(ticket.status)} />
						<StatusBadge label={t(category)} tone="purple" />
						<StatusBadge
							label={t(priority)}
							tone={ticket.priority === 'urgent' || ticket.priority === 'high' ? 'danger' : 'neutral'}
						/>
						{ticket.relatedCourseTitle ? (
							<StatusBadge label={t(ticket.relatedCourseTitle)} tone="course" />
						) : null}
					</div>
					<p className={'ticket-header-meta'}>
						<time dateTime={ticket.createdAt}>
							{t('Created')}{' '}
							{new Date(ticket.createdAt).toLocaleString(undefined, {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</time>
						{ticket.assigneeName ? (
							<>
								<span aria-hidden="true"> · </span>
								{t('Assigned to')} {ticket.assigneeName}
							</>
						) : null}
					</p>
				</div>

				<div className={'ticket-header-actions'}>
					{ticket.canClose ? (
						<button type="button" className={'ticket-btn ghost'} onClick={onClose} disabled={busy}>
							{t('Close ticket')}
						</button>
					) : null}
					{ticket.canReopen ? (
						<button type="button" className={'ticket-btn primary'} onClick={onReopen} disabled={busy}>
							{t('Reopen ticket')}
						</button>
					) : null}
				</div>
			</div>
		</header>
	);
};

export default TicketHeader;
