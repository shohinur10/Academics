import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FeaturedFaq } from '../../../types/support/helpCenter';
import { getFaqBySlug } from '../../../mock/supportFaq.mock';
import FAQCard from '../../support/faq/FAQCard';
import SupportCard from '../../support/common/SupportCard';
import StatusBadge from '../../support/common/StatusBadge';

interface HelpFeaturedFaqsProps {
	items: FeaturedFaq[];
}

const HelpFeaturedFaqs = ({ items }: HelpFeaturedFaqsProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'help-section help-featured-faqs'} aria-labelledby="help-faq-title">
			<div className={'section-heading row'}>
				<div>
					<h2 id="help-faq-title">{t('Featured FAQs')}</h2>
					<p>{t('Top articles learners found most helpful this month.')}</p>
				</div>
				<Link href="/support/faq" className={'section-link'}>
					{t('View all FAQs')}
				</Link>
			</div>
			<ul className={'faq-card-grid'}>
				{items.map((item) => {
					const article = getFaqBySlug(item.slug);
					return (
						<li key={item.id}>
							{article ? (
								<FAQCard article={article} />
							) : (
								<SupportCard
									className={'faq-module-card'}
									href={`/support/faq/${item.slug}`}
									title={t(item.title)}
									excerpt={t(item.excerpt)}
									badge={<StatusBadge label={t(item.category)} tone="purple" />}
									footer={
										<span>
											{item.helpfulCount.toLocaleString()} {t('found helpful')}
										</span>
									}
								/>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default HelpFeaturedFaqs;
