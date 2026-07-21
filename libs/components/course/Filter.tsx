import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Slider,
	Stack,
	Typography,
} from '@mui/material';
import { CourseCategory, CourseLevel, CourseType } from '../../enums/course.enum';
import { CoursesInquiry } from '../../types/course/course.input';
import { MOCK_INSTRUCTORS } from '../../mock/instructors.mock';

const PRICE_MIN = 0;
const PRICE_MAX = 500;

const DURATION_OPTIONS = [
	{ label: 'Any Duration', value: '' },
	{ label: 'Under 4 Weeks', value: '0-3' },
	{ label: '4–8 Weeks', value: '4-8' },
	{ label: '8–12 Weeks', value: '8-12' },
	{ label: '12+ Weeks', value: '12-999' },
];

const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0];

/** Existing platform formats (adapted from the design's Live/Recorded/Self-paced). */
const FORMAT_OPTIONS = [
	{ label: 'Live Online', value: CourseType.ONLINE },
	{ label: 'In-Person', value: CourseType.OFFLINE },
	{ label: 'Hybrid', value: CourseType.HYBRID },
];

interface CourseFilterProps {
	searchFilter: CoursesInquiry;
	initialInput: CoursesInquiry;
	onApply: (filter: CoursesInquiry) => void;
}

const CourseFilter = ({ searchFilter, initialInput, onApply }: CourseFilterProps) => {
	const { t } = useTranslation('common');
	const [localFilter, setLocalFilter] = useState<CoursesInquiry>(searchFilter);

	useEffect(() => {
		setLocalFilter(searchFilter);
	}, [searchFilter]);

	const search = localFilter.search ?? {};

	const updateSearch = (patch: Partial<CoursesInquiry['search']>) => {
		setLocalFilter((prev) => ({ ...prev, page: 1, search: { ...prev.search, ...patch } }));
	};

	const toggleLevel = (level: CourseLevel) => {
		const current = search.levelList ?? [];
		const next = current.includes(level) ? current.filter((l) => l !== level) : [...current, level];
		updateSearch({ levelList: next.length ? next : undefined });
	};

	const toggleFormat = (type: CourseType) => {
		const current = search.typeList ?? [];
		const next = current.includes(type) ? current.filter((v) => v !== type) : [...current, type];
		updateSearch({ typeList: next.length ? next : undefined });
	};

	const durationValue = search.durationRange ? `${search.durationRange.start}-${search.durationRange.end}` : '';

	const priceValue: [number, number] = [
		search.pricesRange?.start ?? PRICE_MIN,
		search.pricesRange?.end ?? PRICE_MAX,
	];

	return (
		<Stack component="aside" className={'course-filter'} aria-label={t('Filter Courses')}>
			<div className={'filter-head'}>
				<Typography component="h2" className={'filter-title'}>
					{t('Filter Courses')}
				</Typography>
				<button type="button" className={'filter-reset-link'} onClick={() => onApply(initialInput)}>
					{t('Reset')}
				</button>
			</div>

			<div className={'filter-group'}>
				<label htmlFor="filter-category">{t('Category')}</label>
				<FormControl fullWidth size="small">
					<Select
						id="filter-category"
						displayEmpty
						value={search.categoryList?.[0] || ''}
						onChange={(e) =>
							updateSearch({ categoryList: e.target.value ? [e.target.value as CourseCategory] : undefined })
						}
					>
						<MenuItem value="">{t('All Categories')}</MenuItem>
						{Object.values(CourseCategory).map((cat) => (
							<MenuItem key={cat} value={cat}>
								{cat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'}>{t('Level')}</span>
				<FormControlLabel
					control={
						<Checkbox
							size="small"
							checked={!search.levelList?.length}
							onChange={() => updateSearch({ levelList: undefined })}
						/>
					}
					label={t('All Levels')}
				/>
				{Object.values(CourseLevel).map((level) => (
					<FormControlLabel
						key={level}
						control={
							<Checkbox size="small" checked={search.levelList?.includes(level) ?? false} onChange={() => toggleLevel(level)} />
						}
						label={t(level.charAt(0) + level.slice(1).toLowerCase())}
					/>
				))}
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'}>{t('Price')}</span>
				<Slider
					value={priceValue}
					min={PRICE_MIN}
					max={PRICE_MAX}
					step={10}
					size="small"
					getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
					valueLabelDisplay="auto"
					onChange={(_, value) => {
						const [start, end] = value as number[];
						updateSearch({
							pricesRange: start === PRICE_MIN && end === PRICE_MAX ? undefined : { start, end },
						});
					}}
				/>
				<div className={'price-values'}>
					<span>${priceValue[0]}</span>
					<span>${priceValue[1]}+</span>
				</div>
			</div>

			<div className={'filter-group'}>
				<label htmlFor="filter-duration">{t('Duration')}</label>
				<FormControl fullWidth size="small">
					<Select
						id="filter-duration"
						displayEmpty
						value={durationValue}
						onChange={(e) => {
							const value = e.target.value as string;
							if (!value) {
								updateSearch({ durationRange: undefined });
							} else {
								const [start, end] = value.split('-').map(Number);
								updateSearch({ durationRange: { start, end } });
							}
						}}
					>
						{DURATION_OPTIONS.map((option) => (
							<MenuItem key={option.label} value={option.value}>
								{t(option.label)}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div className={'filter-group'}>
				<label htmlFor="filter-instructor">{t('Instructors')}</label>
				<FormControl fullWidth size="small">
					<Select
						id="filter-instructor"
						displayEmpty
						value={search.memberId || ''}
						onChange={(e) => updateSearch({ memberId: (e.target.value as string) || undefined })}
					>
						<MenuItem value="">{t('All Instructors')}</MenuItem>
						{MOCK_INSTRUCTORS.map((instructor) => (
							<MenuItem key={instructor._id} value={instructor._id}>
								{instructor.memberNick}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'} id="filter-rating-label">
					{t('Rating')}
				</span>
				<RadioGroup
					aria-labelledby="filter-rating-label"
					value={search.minRating ?? ''}
					onChange={(e) => updateSearch({ minRating: e.target.value ? Number(e.target.value) : undefined })}
				>
					{RATING_OPTIONS.map((rating) => (
						<FormControlLabel
							key={rating}
							value={rating}
							control={<Radio size="small" />}
							label={`★ ${rating.toFixed(1)} ${t('and up')}`}
						/>
					))}
				</RadioGroup>
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'}>{t('Format')}</span>
				{FORMAT_OPTIONS.map((option) => (
					<FormControlLabel
						key={option.value}
						control={
							<Checkbox
								size="small"
								checked={search.typeList?.includes(option.value) ?? false}
								onChange={() => toggleFormat(option.value)}
							/>
						}
						label={t(option.label)}
					/>
				))}
			</div>

			<div className={'filter-actions'}>
				<Button className={'apply-btn'} onClick={() => onApply(localFilter)}>
					{t('Apply Filters')}
				</Button>
				<Button className={'reset-btn'} onClick={() => onApply(initialInput)}>
					{t('Reset')}
				</Button>
			</div>
		</Stack>
	);
};

export default CourseFilter;
