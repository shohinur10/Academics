import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FaqArticle } from '../../../types/support/faq';
import { categoryLabel } from '../../../mock/supportFaq.mock';

interface FAQCardProps {
	article: FaqArticle;
	href?: string;
	compact?: boolean;
}

const FAQCard = ({ article, href, compact = false }: FAQCardProps) => {
	const { t } = useTranslation('common');
	const destination = href ?? `/support/faq/${article.slug}`;

	return (
		<Link href={destination} className={compact ? 'faq-module-card compact' : 'faq-module-card'}>
			<span className={'faq-module-card-category'}>{t(categoryLabel(article.category))}</span>
			<h3>{t(article.question)}</h3>
			{!compact ? <p>{t(article.excerpt)}</p> : null}
			<span className={'faq-module-card-meta'}>
				{article.helpfulCount.toLocaleString()} {t('found helpful')}
			</span>
		</Link>
	);
};

export default FAQCard;
