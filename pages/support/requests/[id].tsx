import React, { useCallback, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import TicketHeader from '../../../libs/components/support/requests/TicketHeader';
import StatusTimeline from '../../../libs/components/support/common/SupportTimeline';
import TicketAttachments from '../../../libs/components/support/requests/TicketAttachments';
import MessageThread from '../../../libs/components/support/requests/MessageThread';
import ReplyForm from '../../../libs/components/support/requests/ReplyForm';
import {
	SupportTicketDetail,
	SupportTicketLoadState,
} from '../../../libs/types/support/request';
import {
	closeSupportTicket,
	fetchSupportTicket,
	reopenSupportTicket,
	replyToSupportTicket,
} from '../../../libs/support/supportTicketService';
import { listSupportTickets } from '../../../libs/mock/supportRequests.store';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const ids = listSupportTickets().map((ticket) => ticket.id);
	const paths = (locales ?? ['en']).flatMap((locale) =>
		ids.map((id) => ({ params: { id }, locale })),
	);
	return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** Support request detail — timeline, conversation, attachments, close/reopen. */
const SupportRequestDetailPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const id = typeof router.query.id === 'string' ? router.query.id : '';

	const [loadState, setLoadState] = useState<SupportTicketLoadState>('loading');
	const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [sourceNote, setSourceNote] = useState('');
	const [actionBusy, setActionBusy] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);

	const load = useCallback(async () => {
		if (!id) return;
		setLoadState('loading');
		setErrorMessage('');
		setActionError(null);
		const result = await fetchSupportTicket(id);
		if (!result.ok) {
			setTicket(null);
			setLoadState(result.code === 'NOT_FOUND' ? 'not_found' : 'error');
			setErrorMessage(result.message || t('Failed to load ticket.'));
			return;
		}
		setTicket(result.ticket ?? null);
		setSourceNote(
			result.source === 'mock'
				? t('Showing isolated demo ticket data until the support API is connected.')
				: '',
		);
		setLoadState('ready');
	}, [id, t]);

	useEffect(() => {
		if (!router.isReady || !id) return;
		void load();
	}, [router.isReady, id, load]);

	const onReply = async (body: string, file: File | null) => {
		if (!ticket) return;
		setActionBusy(true);
		setActionError(null);
		const result = await replyToSupportTicket(ticket.id, body, file);
		setActionBusy(false);
		if (!result.ok || !result.ticket) {
			setActionError(result.message);
			return;
		}
		setTicket(result.ticket);
	};

	const onClose = async () => {
		if (!ticket) return;
		setActionBusy(true);
		setActionError(null);
		const result = await closeSupportTicket(ticket.id);
		setActionBusy(false);
		if (!result.ok || !result.ticket) {
			setActionError(result.message);
			return;
		}
		setTicket(result.ticket);
	};

	const onReopen = async () => {
		if (!ticket) return;
		setActionBusy(true);
		setActionError(null);
		const result = await reopenSupportTicket(ticket.id);
		setActionBusy(false);
		if (!result.ok || !result.ticket) {
			setActionError(result.message);
			return;
		}
		setTicket(result.ticket);
	};

	return (
		<div className={'ticket-detail-page'}>
			<div className={'ticket-detail-container'}>
				{loadState === 'loading' ? (
					<div className={'ticket-state'} role="status" aria-live="polite">
						<div className={'ticket-skeleton'} aria-hidden="true" />
						<p>{t('Loading ticket…')}</p>
					</div>
				) : null}

				{loadState === 'error' ? (
					<div className={'ticket-state error'} role="alert">
						<h1>{t('Could not load ticket')}</h1>
						<p>{t(errorMessage)}</p>
						<div className={'ticket-state-actions'}>
							<button type="button" className={'ticket-btn primary'} onClick={() => void load()}>
								{t('Try again')}
							</button>
							<Link href="/support/requests" className={'ticket-btn ghost'}>
								{t('Back to requests')}
							</Link>
						</div>
					</div>
				) : null}

				{loadState === 'not_found' ? (
					<div className={'ticket-state'} role="status">
						<h1>{t('Ticket not found')}</h1>
						<p>{t('This support request does not exist or is no longer available.')}</p>
						<div className={'ticket-state-actions'}>
							<Link href="/support/requests" className={'ticket-btn primary'}>
								{t('Back to requests')}
							</Link>
							<Link href="/support/contact" className={'ticket-btn ghost'}>
								{t('Contact Support')}
							</Link>
						</div>
					</div>
				) : null}

				{loadState === 'ready' && ticket ? (
					<>
						<TicketHeader
							ticket={ticket}
							busy={actionBusy}
							onClose={() => void onClose()}
							onReopen={() => void onReopen()}
						/>

						{sourceNote ? (
							<p className={'ticket-source-note'} role="note">
								{sourceNote}
							</p>
						) : null}

						{actionError ? (
							<p className={'ticket-action-error'} role="alert">
								{t(actionError)}
							</p>
						) : null}

						<div className={'ticket-detail-layout'}>
							<div className={'ticket-detail-main'}>
								<MessageThread messages={ticket.messages} />
								<ReplyForm
									disabled={!ticket.canReply}
									busy={actionBusy}
									onSubmit={onReply}
								/>
							</div>
							<aside className={'ticket-detail-aside'}>
								<StatusTimeline events={ticket.timeline} />
								<TicketAttachments attachments={ticket.attachments} />
							</aside>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportRequestDetailPage, { title: 'Support Request — Academics' });
