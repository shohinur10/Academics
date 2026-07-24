import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import NoticeCard from '../../../libs/components/support/notices/NoticeCard';
import NoticeToolbar from '../../../libs/components/support/notices/NoticeToolbar';
import {
	NOTICE_CATEGORIES,
	NoticeCategoryId,
	NoticeListQuery,
	emptyNoticeListQuery,
} from '../../../libs/types/support/notice';
import {
	countNoticesByCategory,
	filterNotices,
} from '../../../libs/mock/supportNotices.mock';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const parseCategory = (value: unknown): NoticeCategoryId | 'all' => {
	if (value === 'all' || typeof value !== 'string') return 'all';
	return NOTICE_CATEGORIES.some((category) => category.id === value)
		? (value as NoticeCategoryId)
		: 'all';
};

const queryFromRouter = (query: Record<string, string | string[] | undefined>): NoticeListQuery => ({
	q: typeof query.q === 'string' ? query.q : '',
	category: parseCategory(query.category),
});

/** ACADEMICS Notice Center — modern card announcements hub. */
const SupportNoticesPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const counts = useMemo(() => countNoticesByCategory(), []);
	const [listQuery, setListQuery] = useState<NoticeListQuery>(emptyNoticeListQuery());
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;
		setListQuery(queryFromRouter(router.query));
		setReady(true);
	}, [router.isReady, router.query]);

	const syncUrl = useCallback(
		(next: NoticeListQuery) => {
			const query: Record<string, string> = {};
			if (next.q) query.q = next.q;
			if (next.category !== 'all') query.category = next.category;
			void router.replace({ pathname: '/support/notices', query }, undefined, {
				shallow: true,
				scroll: false,
			});
		},
		[router],
	);

	const updateQuery = useCallback(
		(patch: Partial<NoticeListQuery>) => {
			setListQuery((prev) => {
				const next = { ...prev, ...patch };
				syncUrl(next);
				return next;
			});
		},
		[syncUrl],
	);

	const notices = useMemo(() => (ready ? filterNotices(listQuery) : []), [listQuery, ready]);

	return (
		<div className={'notice-center-page'}>
			<div className={'notice-center-container'}>
				<nav className={'notice-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/cs">{t('Help Center')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t('Notices')}</span>
				</nav>

				<header className={'notice-center-header'}>
					<p className={'help-eyebrow'}>{t('Help Center')}</p>
					<h1>{t('Notice Center')}</h1>
					<p>{t('Platform updates, maintenance windows, product changes, and policy announcements.')}</p>
				</header>

				<NoticeToolbar
					query={listQuery}
					counts={counts}
					resultCount={notices.length}
					onCategoryChange={(category) => updateQuery({ category })}
					onSearchChange={(q) => updateQuery({ q })}
				/>

				{notices.length ? (
					<ul className={'notice-card-grid'}>
						{notices.map((notice) => (
							<li key={notice.id}>
								<NoticeCard notice={notice} />
							</li>
						))}
					</ul>
				) : (
					<div className={'notice-empty'} role="status">
						<p>{t('No notices match your search.')}</p>
						<p>{t('Try another keyword or choose a different filter.')}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportNoticesPage, { title: 'Notice Center — Academics' });
