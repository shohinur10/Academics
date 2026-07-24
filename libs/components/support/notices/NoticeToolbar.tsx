import React from 'react';
import { useTranslation } from 'next-i18next';
import {
	NOTICE_CATEGORIES,
	NoticeCategoryId,
	NoticeListQuery,
} from '../../../types/support/notice';
import SearchInput from '../common/SearchInput';
import CategoryFilter from '../common/CategoryFilter';

interface NoticeToolbarProps {
	query: NoticeListQuery;
	counts: Record<NoticeCategoryId | 'all', number>;
	resultCount: number;
	onCategoryChange: (category: NoticeCategoryId | 'all') => void;
	onSearchChange: (q: string) => void;
}

const NoticeToolbar = ({
	query,
	counts,
	resultCount,
	onCategoryChange,
	onSearchChange,
}: NoticeToolbarProps) => {
	const { t } = useTranslation('common');

	const filters: { id: NoticeCategoryId | 'all'; label: string; count: number }[] = [
		{ id: 'all', label: t('All'), count: counts.all },
		...NOTICE_CATEGORIES.map((category) => ({
			id: category.id,
			label: t(category.label),
			count: counts[category.id] ?? 0,
		})),
	];

	return (
		<div className={'notice-toolbar'}>
			<SearchInput
				id="notice-search-input"
				className="notice-search support-search"
				label={t('Search notices')}
				placeholder={t('Search notices...')}
				value={query.q}
				submitLabel={t('Search')}
				onSubmit={onSearchChange}
			/>

			<CategoryFilter
				className="notice-filter-row support-category-chips"
				ariaLabel={t('Filter notices')}
				options={filters}
				value={query.category}
				onChange={onCategoryChange}
			/>

			<p className={'notice-result-count'} aria-live="polite">
				{resultCount} {t('notices')}
			</p>
		</div>
	);
};

export default NoticeToolbar;
