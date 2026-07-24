import React from 'react';
import { useTranslation } from 'next-i18next';
import {
	FAQ_FILTER_OPTIONS,
	FAQ_SORT_OPTIONS,
	FaqFilterOption,
	FaqSortOption,
} from '../../../types/support/faq';
import SearchInput from '../common/SearchInput';

interface SearchFAQProps {
	query: string;
	filter: FaqFilterOption;
	sort: FaqSortOption;
	onQueryChange: (query: string) => void;
	onFilterChange: (filter: FaqFilterOption) => void;
	onSortChange: (sort: FaqSortOption) => void;
	resultCount: number;
}

const SearchFAQ = ({
	query,
	filter,
	sort,
	onQueryChange,
	onFilterChange,
	onSortChange,
	resultCount,
}: SearchFAQProps) => {
	const { t } = useTranslation('common');

	return (
		<div className={'faq-search-toolbar'}>
			<SearchInput
				id="faq-module-search"
				className="faq-search support-search"
				label={t('Search FAQ')}
				placeholder={t('Search FAQ questions and answers...')}
				value={query}
				submitLabel={t('Search')}
				onSubmit={onQueryChange}
			/>

			<div className={'faq-toolbar-controls'}>
				<label className={'faq-control'}>
					<span>{t('Filter')}</span>
					<select
						value={filter}
						onChange={(event) => onFilterChange(event.target.value as FaqFilterOption)}
						aria-label={t('Filter FAQs')}
					>
						{FAQ_FILTER_OPTIONS.map((option) => (
							<option key={option.id} value={option.id}>
								{t(option.label)}
							</option>
						))}
					</select>
				</label>

				<label className={'faq-control'}>
					<span>{t('Sort')}</span>
					<select
						value={sort}
						onChange={(event) => onSortChange(event.target.value as FaqSortOption)}
						aria-label={t('Sort FAQs')}
					>
						{FAQ_SORT_OPTIONS.map((option) => (
							<option key={option.id} value={option.id}>
								{t(option.label)}
							</option>
						))}
					</select>
				</label>

				<p className={'faq-result-count'} aria-live="polite">
					{resultCount} {t('articles')}
				</p>
			</div>
		</div>
	);
};

export default SearchFAQ;
