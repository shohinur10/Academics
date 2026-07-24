import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import FAQCard from '../../../libs/components/support/faq/FAQCard';
import HelpfulButtons from '../../../libs/components/support/faq/HelpfulButtons';
import {
	FAQ_ARTICLES,
	categoryLabel,
	getFaqBySlug,
	getRelatedFaqs,
} from '../../../libs/mock/supportFaq.mock';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const paths = (locales ?? ['en']).flatMap((locale) =>
		FAQ_ARTICLES.map((article) => ({ params: { slug: article.slug }, locale })),
	);
	return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
	const slug = typeof params?.slug === 'string' ? params.slug : '';
	if (!getFaqBySlug(slug)) {
		return { notFound: true };
	}
	return {
		props: {
			...(await serverSideTranslations(locale ?? 'en', ['common'])),
		},
	};
};

const answerParagraphs = (answer: string) =>
	answer
		.split(/\n\n+/)
		.map((part) => part.trim())
		.filter(Boolean);

/** FAQ article detail — question, answer, related, helpful, contact. */
const SupportFaqDetailPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
	const article = getFaqBySlug(slug);

	if (!article) {
		return (
			<div className={'faq-module-page'}>
				<div className={'faq-module-container'}>
					<div className={'faq-detail-card'}>
						<h1>{t('Article not found')}</h1>
						<p>{t('This FAQ may have moved. Browse the full list instead.')}</p>
						<Link href="/support/faq" className={'faq-contact-btn'}>
							{t('Back to FAQ')}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const related = getRelatedFaqs(article);

	return (
		<div className={'faq-module-page'}>
			<div className={'faq-module-container narrow'}>
				<nav className={'faq-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/cs">{t('Help Center')}</Link>
					<span aria-hidden="true">/</span>
					<Link href="/support/faq">{t('FAQ')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t(categoryLabel(article.category))}</span>
				</nav>

				<article className={'faq-detail-card'}>
					<p className={'faq-detail-category'}>{t(categoryLabel(article.category))}</p>
					<h1>{t(article.question)}</h1>
					<p className={'faq-detail-meta'}>
						{article.helpfulCount.toLocaleString()} {t('found helpful')}
						<span aria-hidden="true"> · </span>
						<time dateTime={article.updatedAt}>
							{t('Updated')} {article.updatedAt}
						</time>
					</p>

					<div className={'faq-answer'}>
						{answerParagraphs(article.answer).map((paragraph, index) => (
							<p key={`${article.id}-p-${index}`}>{t(paragraph)}</p>
						))}
					</div>

					{related.length ? (
						<section className={'faq-related'} aria-labelledby="faq-related-title">
							<h2 id="faq-related-title">{t('Related articles')}</h2>
							<ul className={'faq-related-grid'}>
								{related.map((item) => (
									<li key={item.id}>
										<FAQCard article={item} />
									</li>
								))}
							</ul>
						</section>
					) : null}

					<HelpfulButtons articleId={article.id} />
				</article>

				<p className={'faq-detail-back'}>
					<Link href={`/support/faq?category=${article.category}&open=${article.slug}`}>
						{t('Back to FAQ list')}
					</Link>
				</p>
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportFaqDetailPage, { title: 'FAQ — Academics' });
