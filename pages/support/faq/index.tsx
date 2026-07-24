import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import FAQSidebar from '../../../libs/components/support/faq/FAQSidebar';
import SearchFAQ from '../../../libs/components/support/faq/SearchFAQ';
import FAQAccordion from '../../../libs/components/support/faq/FAQAccordion';
import {
	FAQ_CATEGORIES,
	FaqCategoryId,
	FaqFilterOption,
	FaqListQuery,
	FaqSortOption,
	emptyFaqListQuery,
} from '../../../libs/types/support/faq';
import {
	countFaqsByCategory,
	filterAndSortFaqs,
} from '../../../libs/mock/supportFaq.mock';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const parseCategory = (value: unknown): FaqCategoryId | 'all' => {
	if (value === 'all' || typeof value !== 'string') return 'all';
	return FAQ_CATEGORIES.some((category) => category.id === value) ? (value as FaqCategoryId) : 'all';
};

const parseFilter = (value: unknown): FaqFilterOption => {
	if (value === 'popular' || value === 'recent') return value;
	return 'all';
};

const parseSort = (value: unknown): FaqSortOption => {
	if (value === 'newest' || value === 'az') return value;
	return 'helpful';
};

const queryFromRouter = (query: Record<string, string | string[] | undefined>): FaqListQuery => ({
	q: typeof query.q === 'string' ? query.q : '',
	category: parseCategory(query.category ?? query.topic),
	filter: parseFilter(query.filter),
	sort: parseSort(query.sort),
	open: typeof query.open === 'string' ? query.open : undefined,
});

/** ACADEMICS FAQ module — searchable category accordion hub. */
const SupportFaqIndexPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const counts = useMemo(() => countFaqsByCategory(), []);
	const [listQuery, setListQuery] = useState<FaqListQuery>(emptyFaqListQuery());
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;
		const next = queryFromRouter(router.query);
		if (!next.open && typeof window !== 'undefined' && window.location.hash) {
			next.open = window.location.hash.replace(/^#/, '') || undefined;
		}
		setListQuery(next);
		setReady(true);
	}, [router.isReady, router.query]);

	const syncUrl = useCallback(
		(next: FaqListQuery) => {
			const query: Record<string, string> = {};
			if (next.q) query.q = next.q;
			if (next.category !== 'all') query.category = next.category;
			if (next.filter !== 'all') query.filter = next.filter;
			if (next.sort !== 'helpful') query.sort = next.sort;
			if (next.open) query.open = next.open;

			void router.replace({ pathname: '/support/faq', query }, undefined, { shallow: true, scroll: false });
		},
		[router],
	);

	const updateQuery = useCallback(
		(patch: Partial<FaqListQuery>) => {
			setListQuery((prev) => {
				const next = { ...prev, ...patch };
				syncUrl(next);
				return next;
			});
		},
		[syncUrl],
	);

	const articles = useMemo(() => (ready ? filterAndSortFaqs(listQuery) : []), [listQuery, ready]);

	return (
		<div className={'faq-module-page'}>
			<div className={'faq-module-container'}>
				<nav className={'faq-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/cs">{t('Help Center')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t('FAQ')}</span>
				</nav>

				<header className={'faq-module-header'}>
					<p className={'help-eyebrow'}>{t('Help Center')}</p>
					<h1>{t('Frequently asked questions')}</h1>
					<p>{t('Search articles by topic, or open a question to read the full answer.')}</p>
				</header>

				<div className={'faq-module-layout'}>
					<aside className={'faq-module-aside'}>
						<FAQSidebar
							categories={FAQ_CATEGORIES}
							counts={counts}
							active={listQuery.category}
							onSelect={(category) => updateQuery({ category, open: undefined })}
						/>
					</aside>

					<div className={'faq-module-main'}>
						<label className={'faq-mobile-category'}>
							<span>{t('Category')}</span>
							<select
								value={listQuery.category}
								onChange={(event) =>
									updateQuery({
										category: parseCategory(event.target.value),
										open: undefined,
									})
								}
							>
								<option value="all">{t('All')}</option>
								{FAQ_CATEGORIES.map((category) => (
									<option key={category.id} value={category.id}>
										{t(category.label)}
									</option>
								))}
							</select>
						</label>

						<SearchFAQ
							query={listQuery.q}
							filter={listQuery.filter}
							sort={listQuery.sort}
							resultCount={articles.length}
							onQueryChange={(q) => updateQuery({ q, open: undefined })}
							onFilterChange={(filter) => updateQuery({ filter, open: undefined })}
							onSortChange={(sort) => updateQuery({ sort })}
						/>

						<FAQAccordion
							articles={articles}
							openSlug={listQuery.open ?? null}
							onOpenChange={(slug) => updateQuery({ open: slug ?? undefined })}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportFaqIndexPage, { title: 'FAQ — Academics' });
