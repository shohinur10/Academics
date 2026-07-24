import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FaqCategory, FaqCategoryId } from '../../../types/support/faq';
import CategoryFilter from '../common/CategoryFilter';

interface FAQSidebarProps {
	categories: FaqCategory[];
	counts: Record<FaqCategoryId | 'all', number>;
	active: FaqCategoryId | 'all';
	onSelect: (category: FaqCategoryId | 'all') => void;
}

const FAQSidebar = ({ categories, counts, active, onSelect }: FAQSidebarProps) => {
	const { t } = useTranslation('common');

	const items: { id: FaqCategoryId | 'all'; label: string; count: number }[] = [
		{ id: 'all', label: t('All'), count: counts.all },
		...categories.map((category) => ({
			id: category.id,
			label: t(category.label),
			count: counts[category.id] ?? 0,
		})),
	];

	return (
		<nav className={'faq-sidebar'} aria-label={t('FAQ categories')}>
			<p className={'faq-sidebar-title'}>{t('Categories')}</p>
			<CategoryFilter
				variant="list"
				className="faq-sidebar-list support-category-list"
				ariaLabel={t('FAQ categories')}
				options={items}
				value={active}
				onChange={onSelect}
			/>

			<div className={'faq-sidebar-help'}>
				<p>{t('Still need help?')}</p>
				<Link href="/support/contact" className={'faq-contact-btn'}>
					{t('Contact Support')}
				</Link>
			</div>
		</nav>
	);
};

export default FAQSidebar;
