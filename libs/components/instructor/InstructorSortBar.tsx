import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { FormControl, IconButton, MenuItem, Select } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Direction } from '../../enums/common.enum';

export interface InstructorSortOption {
	label: string;
	sort: string;
	direction: Direction;
}

export const INSTRUCTOR_SORT_OPTIONS: InstructorSortOption[] = [
	{ label: 'Most Popular', sort: 'memberRank', direction: Direction.DESC },
	{ label: 'Highest Rated', sort: 'memberRating', direction: Direction.DESC },
	{ label: 'Most Students', sort: 'memberStudents', direction: Direction.DESC },
	{ label: 'Most Courses', sort: 'memberProperties', direction: Direction.DESC },
	{ label: 'Most Experienced', sort: 'memberExperienceYears', direction: Direction.DESC },
	{ label: 'Newest', sort: 'createdAt', direction: Direction.DESC },
];

interface InstructorSortBarProps {
	total: number;
	initialText?: string;
	sortValue: string;
	viewMode: 'grid' | 'list';
	onSearch: (text: string) => void;
	onSortChange: (option: InstructorSortOption) => void;
	onViewModeChange: (mode: 'grid' | 'list') => void;
	onOpenFilters: () => void;
}

const InstructorSortBar = ({
	total,
	initialText,
	sortValue,
	viewMode,
	onSearch,
	onSortChange,
	onViewModeChange,
	onOpenFilters,
}: InstructorSortBarProps) => {
	const { t } = useTranslation('common');
	const [text, setText] = useState(initialText ?? '');

	useEffect(() => {
		setText(initialText ?? '');
	}, [initialText]);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(text.trim());
	};

	const clearSearch = () => {
		setText('');
		onSearch('');
	};

	return (
		<div className={'instructor-sort-bar'}>
			<form className={'instructor-search-form'} role="search" onSubmit={submit}>
				<label htmlFor="instructor-search-input" className={'visually-hidden'}>
					{t('Search instructors')}
				</label>
				<div className={'search-field'}>
					<SearchOutlinedIcon aria-hidden="true" />
					<input
						id="instructor-search-input"
						type="search"
						value={text}
						placeholder={t('Search instructors by name, language or expertise...')}
						onChange={(e) => setText(e.target.value)}
					/>
					{text && (
						<button type="button" className={'clear-search-btn'} aria-label={t('Clear search')} onClick={clearSearch}>
							<CloseOutlinedIcon />
						</button>
					)}
				</div>
				<button type="submit" className={'search-submit-btn'}>
					{t('Search')}
				</button>
			</form>

			<div className={'sort-row'}>
				<button type="button" className={'mobile-filter-btn'} aria-label={t('Filter Instructors')} onClick={onOpenFilters}>
					<TuneOutlinedIcon />
					{t('Filters')}
				</button>

				<p className={'result-count'} aria-live="polite">
					<strong>{total}</strong> {t('Instructors Found')}
				</p>

				<div className={'sort-controls'}>
					<label htmlFor="instructor-sort-select" className={'sort-label'}>
						{t('Sort by')}
					</label>
					<FormControl size="small" className={'sort-select'}>
						<Select
							id="instructor-sort-select"
							value={sortValue}
							onChange={(e) => {
								const option = INSTRUCTOR_SORT_OPTIONS.find((o) => `${o.sort}:${o.direction}` === e.target.value);
								if (option) onSortChange(option);
							}}
						>
							{INSTRUCTOR_SORT_OPTIONS.map((option) => (
								<MenuItem key={option.label} value={`${option.sort}:${option.direction}`}>
									{t(option.label)}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<div className={'view-toggle'} role="group" aria-label={t('View mode')}>
						<IconButton
							className={viewMode === 'grid' ? 'active' : ''}
							aria-label={t('Grid view')}
							aria-pressed={viewMode === 'grid'}
							onClick={() => onViewModeChange('grid')}
						>
							<GridViewRoundedIcon />
						</IconButton>
						<IconButton
							className={viewMode === 'list' ? 'active' : ''}
							aria-label={t('List view')}
							aria-pressed={viewMode === 'list'}
							onClick={() => onViewModeChange('list')}
						>
							<ViewListOutlinedIcon />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InstructorSortBar;
