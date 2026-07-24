import React, { useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import SearchInput from '../../../libs/components/support/common/SearchInput';
import CategoryFilter from '../../../libs/components/support/common/CategoryFilter';
import RequestCard from '../../../libs/components/support/common/RequestCard';
import {
	listSupportTickets,
	supportTicketsRevisionVar,
} from '../../../libs/mock/supportRequests.store';
import { SupportTicketStatus } from '../../../libs/types/support/request';

const PAGE_SIZE = 6;

type StatusFilter = SupportTicketStatus | 'all';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** My Support Requests list — search, status filter, pagination. */
const SupportRequestsPage: NextPage = () => {
	const { t } = useTranslation('common');
	const revision = useReactiveVar(supportTicketsRevisionVar);
	const [q, setQ] = useState('');
	const [status, setStatus] = useState<StatusFilter>('all');
	const [page, setPage] = useState(1);

	const tickets = useMemo(() => {
		void revision;
		return listSupportTickets();
	}, [revision]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return tickets.filter((ticket) => {
			if (status !== 'all' && ticket.status !== status) return false;
			if (!needle) return true;
			const hay = `${ticket.subject} ${ticket.id} ${ticket.category} ${ticket.relatedCourseTitle ?? ''}`.toLowerCase();
			return hay.includes(needle);
		});
	}, [tickets, q, status]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const statusOptions: { id: StatusFilter; label: string; count: number }[] = [
		{ id: 'all', label: t('All'), count: tickets.length },
		{ id: 'created', label: t('Created'), count: tickets.filter((item) => item.status === 'created').length },
		{ id: 'waiting', label: t('Waiting'), count: tickets.filter((item) => item.status === 'waiting').length },
		{
			id: 'in_progress',
			label: t('In Progress'),
			count: tickets.filter((item) => item.status === 'in_progress').length,
		},
		{ id: 'resolved', label: t('Resolved'), count: tickets.filter((item) => item.status === 'resolved').length },
		{ id: 'closed', label: t('Closed'), count: tickets.filter((item) => item.status === 'closed').length },
	];

	return (
		<div className={'ticket-detail-page'}>
			<div className={'ticket-detail-container'}>
				<nav className={'ticket-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/cs">{t('Help Center')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t('My Support Requests')}</span>
				</nav>

				<header className={'ticket-list-header'}>
					<p className={'help-eyebrow'}>{t('Help Center')}</p>
					<h1>{t('My Support Requests')}</h1>
					<p>{t('Track open and resolved tickets in one place.')}</p>
					<Link href="/support/contact" className={'ticket-btn primary'}>
						{t('Send Request')}
					</Link>
				</header>

				<div className={'ticket-list-toolbar'}>
					<SearchInput
						id="requests-search"
						className="support-search"
						label={t('Search requests')}
						placeholder={t('Search by subject, ID, or course…')}
						value={q}
						submitLabel={t('Search')}
						onSubmit={(value) => {
							setQ(value);
							setPage(1);
						}}
					/>
					<CategoryFilter
						ariaLabel={t('Filter by status')}
						options={statusOptions}
						value={status}
						onChange={(next) => {
							setStatus(next);
							setPage(1);
						}}
					/>
					<p className={'ticket-list-count'} aria-live="polite">
						{filtered.length} {t('requests')}
					</p>
				</div>

				{visible.length ? (
					<ul className={'ticket-list'}>
						{visible.map((ticket) => (
							<li key={ticket.id}>
								<RequestCard ticket={ticket} />
							</li>
						))}
					</ul>
				) : (
					<div className={'ticket-empty'} role="status">
						<p>{t('No support requests match your search.')}</p>
						<p>{t('Try another keyword, clear filters, or send a new request.')}</p>
						<Link href="/support/contact" className={'ticket-btn primary'}>
							{t('Contact Support')}
						</Link>
					</div>
				)}

				{filtered.length > PAGE_SIZE ? (
					<nav className={'ticket-pagination'} aria-label={t('Requests pagination')}>
						<button
							type="button"
							className={'ticket-btn ghost'}
							disabled={currentPage <= 1}
							onClick={() => setPage((prev) => Math.max(1, prev - 1))}
						>
							{t('Previous')}
						</button>
						<p>
							{t('Page')} {currentPage} / {totalPages}
						</p>
						<button
							type="button"
							className={'ticket-btn ghost'}
							disabled={currentPage >= totalPages}
							onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
						>
							{t('Next')}
						</button>
					</nav>
				) : null}
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportRequestsPage, { title: 'My Support Requests — Academics' });
