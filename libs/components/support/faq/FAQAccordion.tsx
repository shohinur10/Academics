import React, { useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { FaqArticle } from '../../../types/support/faq';
import { categoryLabel, getRelatedFaqs } from '../../../mock/supportFaq.mock';
import FAQCard from './FAQCard';
import HelpfulButtons from './HelpfulButtons';

interface FAQAccordionProps {
	articles: FaqArticle[];
	openSlug: string | null;
	onOpenChange: (slug: string | null) => void;
}

const answerParagraphs = (answer: string) =>
	answer
		.split(/\n\n+/)
		.map((part) => part.trim())
		.filter(Boolean);

const FAQAccordion = ({ articles, openSlug, onOpenChange }: FAQAccordionProps) => {
	const { t } = useTranslation('common');
	const baseId = useId();
	const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	useEffect(() => {
		if (!openSlug) return;
		const node = itemRefs.current[openSlug];
		if (node) {
			node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [openSlug]);

	if (!articles.length) {
		return (
			<div className={'faq-empty'} role="status">
				<p>{t('No FAQ articles match your search.')}</p>
				<p>{t('Try another keyword or browse a different category.')}</p>
			</div>
		);
	}

	return (
		<div className={'faq-accordion'} role="region" aria-label={t('FAQ list')}>
			{articles.map((article) => {
				const expanded = openSlug === article.slug;
				const panelId = `${baseId}-${article.slug}-panel`;
				const headerId = `${baseId}-${article.slug}-header`;
				const related = expanded ? getRelatedFaqs(article) : [];

				return (
					<article key={article.id} className={expanded ? 'faq-acc-item open' : 'faq-acc-item'} id={article.slug}>
						<h3 className={'faq-acc-heading'}>
							<button
								type="button"
								id={headerId}
								className={'faq-acc-trigger'}
								aria-expanded={expanded}
								aria-controls={panelId}
								ref={(node) => {
									itemRefs.current[article.slug] = node;
								}}
								onClick={() => onOpenChange(expanded ? null : article.slug)}
							>
								<span className={'faq-acc-copy'}>
									<span className={'faq-acc-category'}>{t(categoryLabel(article.category))}</span>
									<span className={'faq-acc-question'}>{t(article.question)}</span>
								</span>
								<ExpandMoreRoundedIcon className={'faq-acc-chevron'} aria-hidden="true" />
							</button>
						</h3>

						<div
							id={panelId}
							role="region"
							aria-labelledby={headerId}
							hidden={!expanded}
							className={'faq-acc-panel'}
						>
							<div className={'faq-acc-panel-inner'}>
								<div className={'faq-answer'}>
									{answerParagraphs(article.answer).map((paragraph, index) => (
										<p key={`${article.id}-p-${index}`}>{t(paragraph)}</p>
									))}
								</div>

								<p className={'faq-acc-open-full'}>
									<Link href={`/support/faq/${article.slug}`}>{t('Open full article')}</Link>
								</p>

								{related.length ? (
									<div className={'faq-related'}>
										<h4>{t('Related articles')}</h4>
										<ul className={'faq-related-grid'}>
											{related.map((item) => (
												<li key={item.id}>
													<FAQCard article={item} compact />
												</li>
											))}
										</ul>
									</div>
								) : null}

								<HelpfulButtons articleId={article.id} />
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
};

export default FAQAccordion;
