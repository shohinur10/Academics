import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import NoticeCard from '../../../libs/components/support/notices/NoticeCard';
import NoticeAttachments from '../../../libs/components/support/notices/NoticeAttachments';
import NoticeAdjacentNav from '../../../libs/components/support/notices/NoticeAdjacentNav';
import {
	NOTICE_ARTICLES,
	getNoticeBySlug,
	getNoticeNeighbors,
	getRelatedNotices,
	noticeCategoryLabel,
} from '../../../libs/mock/supportNotices.mock';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const paths = (locales ?? ['en']).flatMap((locale) =>
		NOTICE_ARTICLES.map((notice) => ({ params: { slug: notice.slug }, locale })),
	);
	return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
	const slug = typeof params?.slug === 'string' ? params.slug : '';
	if (!getNoticeBySlug(slug)) {
		return { notFound: true };
	}
	return {
		props: {
			...(await serverSideTranslations(locale ?? 'en', ['common'])),
		},
	};
};

const bodyParagraphs = (body: string) =>
	body
		.split(/\n\n+/)
		.map((part) => part.trim())
		.filter(Boolean);

const formatLongDate = (iso: string) =>
	new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

/** Notice detail — title, category, body, attachments, related, prev/next. */
const SupportNoticeDetailPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
	const notice = getNoticeBySlug(slug);

	if (!notice) {
		return (
			<div className={'notice-center-page'}>
				<div className={'notice-center-container narrow'}>
					<div className={'notice-detail-card'}>
						<h1>{t('Notice not found')}</h1>
						<p>{t('This notice may have been removed. Browse the Notice Center instead.')}</p>
						<Link href="/support/notices" className={'notice-back-btn'}>
							<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
							{t('Back to Notice Center')}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const related = getRelatedNotices(notice);
	const { prev, next } = getNoticeNeighbors(notice.slug);

	return (
		<div className={'notice-center-page'}>
			<div className={'notice-center-container narrow'}>
				<nav className={'notice-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/cs">{t('Help Center')}</Link>
					<span aria-hidden="true">/</span>
					<Link href="/support/notices">{t('Notices')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t(noticeCategoryLabel(notice.category))}</span>
				</nav>

				<p className={'notice-detail-actions'}>
					<Link href="/support/notices" className={'notice-back-btn'}>
						<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
						{t('Back')}
					</Link>
				</p>

				<article className={'notice-detail-card'}>
					<div className={'notice-detail-meta-row'}>
						<span className={`notice-badge cat-${notice.category}`}>
							{t(noticeCategoryLabel(notice.category))}
						</span>
						{notice.pinned ? (
							<span className={'notice-pinned'}>
								<PushPinOutlinedIcon fontSize="inherit" aria-hidden="true" />
								{t('Pinned')}
							</span>
						) : null}
					</div>

					<h1>{t(notice.title)}</h1>
					<p className={'notice-detail-date'}>
						<time dateTime={notice.publishedAt}>{formatLongDate(notice.publishedAt)}</time>
					</p>

					<div className={'notice-body'}>
						{bodyParagraphs(notice.body).map((paragraph, index) => (
							<p key={`${notice.id}-p-${index}`}>{t(paragraph)}</p>
						))}
					</div>

					<NoticeAttachments attachments={notice.attachments} />
				</article>

				{related.length ? (
					<section className={'notice-related'} aria-labelledby="notice-related-title">
						<h2 id="notice-related-title">{t('Related notices')}</h2>
						<ul className={'notice-related-grid'}>
							{related.map((item) => (
								<li key={item.id}>
									<NoticeCard notice={item} compact />
								</li>
							))}
						</ul>
					</section>
				) : null}

				<NoticeAdjacentNav prev={prev} next={next} />
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportNoticeDetailPage, { title: 'Notice — Academics' });
