import React from 'react';
import { useTranslation } from 'next-i18next';
import { FormControl, IconButton, MenuItem, Select } from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { Direction } from '../../enums/common.enum';

export interface SortOption {
	label: string;
	sort: string;
	direction: Direction;
}

export const SORT_OPTIONS: SortOption[] = [
	{ label: 'Most Popular', sort: 'courseRank', direction: Direction.DESC },
	{ label: 'Recommended', sort: 'courseViews', direction: Direction.DESC },
	{ label: 'Newest', sort: 'createdAt', direction: Direction.DESC },
	{ label: 'Highest Rated', sort: 'courseRating', direction: Direction.DESC },
	{ label: 'Price: Low to High', sort: 'coursePrice', direction: Direction.ASC },
	{ label: 'Price: High to Low', sort: 'coursePrice', direction: Direction.DESC },
];

interface CourseSortBarProps {
	total: number;
	sortValue: string;
	viewMode: 'grid' | 'list';
	onSortChange: (option: SortOption) => void;
	onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CourseSortBar = ({ total, sortValue, viewMode, onSortChange, onViewModeChange }: CourseSortBarProps) => {
	const { t } = useTranslation('common');

	return (
		<div className={'course-sort-bar'}>
			<p className={'result-count'} aria-live="polite">
				<strong>{total}</strong> {t('Courses Found')}
			</p>
			<div className={'sort-controls'}>
				<label htmlFor="course-sort-select" className={'sort-label'}>
					{t('Sort by')}
				</label>
				<FormControl size="small" className={'sort-select'}>
					<Select
						id="course-sort-select"
						value={sortValue}
						onChange={(e) => {
							const option = SORT_OPTIONS.find((o) => `${o.sort}:${o.direction}` === e.target.value);
							if (option) onSortChange(option);
						}}
					>
						{SORT_OPTIONS.map((option) => (
							<MenuItem key={option.label} value={`${option.sort}:${option.direction}`}>
								{t(option.label)}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<div className={'view-toggle'} role="group" aria-label="View mode">
					<IconButton
						className={viewMode === 'grid' ? 'active' : ''}
						aria-label="Grid view"
						aria-pressed={viewMode === 'grid'}
						onClick={() => onViewModeChange('grid')}
					>
						<GridViewRoundedIcon />
					</IconButton>
					<IconButton
						className={viewMode === 'list' ? 'active' : ''}
						aria-label="List view"
						aria-pressed={viewMode === 'list'}
						onClick={() => onViewModeChange('list')}
					>
						<ViewListOutlinedIcon />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

export default CourseSortBar;
