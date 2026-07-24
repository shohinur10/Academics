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
	Stack,
	Typography,
} from '@mui/material';
import { InstructorsInquiry } from '../../types/member/member.input';
import { InstructorTeachingFormat } from '../../types/member/member';
import { INSTRUCTOR_FORMAT_LABELS } from './instructorPresentation';

const LANGUAGES = ['English', 'Korean', 'Japanese', 'Chinese', 'French', 'Spanish'];
const EXPERTISE = ['Conversation', 'Business', 'IELTS', 'TOPIK', 'Grammar', 'Pronunciation', 'Kids', 'Travel'];
const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0];
const FORMAT_OPTIONS: InstructorTeachingFormat[] = ['LIVE', 'RECORDED', 'PRIVATE'];
const AVAILABILITY = ['Weekday', 'Weekend', 'Morning', 'Afternoon', 'Evening'];
const EXPERIENCE = [
	{ label: '1–3 Years', value: '1-3' },
	{ label: '3–5 Years', value: '3-5' },
	{ label: '5–10 Years', value: '5-10' },
	{ label: '10+ Years', value: '10+' },
];

interface InstructorFilterProps {
	searchFilter: InstructorsInquiry;
	initialInput: InstructorsInquiry;
	onApply: (filter: InstructorsInquiry) => void;
}

const InstructorFilter = ({ searchFilter, initialInput, onApply }: InstructorFilterProps) => {
	const { t } = useTranslation('common');
	const [localFilter, setLocalFilter] = useState<InstructorsInquiry>(searchFilter);

	useEffect(() => {
		setLocalFilter(searchFilter);
	}, [searchFilter]);

	const search = localFilter.search ?? {};

	const updateSearch = (patch: Partial<InstructorsInquiry['search']>) => {
		setLocalFilter((prev) => ({ ...prev, page: 1, search: { ...prev.search, ...patch } }));
	};

	const toggleExpertise = (tag: string) => {
		const current = search.expertise ?? [];
		const next = current.includes(tag) ? current.filter((v) => v !== tag) : [...current, tag];
		updateSearch({ expertise: next.length ? next : undefined });
	};

	const toggleFormat = (format: InstructorTeachingFormat) => {
		const current = search.teachingFormats ?? [];
		const next = current.includes(format) ? current.filter((v) => v !== format) : [...current, format];
		updateSearch({ teachingFormats: next.length ? next : undefined });
	};

	const toggleExperience = (range: string) => {
		const current = search.experienceRanges ?? [];
		const next = current.includes(range) ? current.filter((v) => v !== range) : [...current, range];
		updateSearch({ experienceRanges: next.length ? next : undefined });
	};

	return (
		<Stack component="aside" className={'instructor-filter'} aria-label={t('Filter Instructors')}>
			<div className={'filter-head'}>
				<Typography component="h2" className={'filter-title'}>
					{t('Filter Instructors')}
				</Typography>
				<button type="button" className={'filter-reset-link'} onClick={() => onApply(initialInput)}>
					{t('Reset')}
				</button>
			</div>

			<div className={'filter-group'}>
				<label htmlFor="instructor-language">{t('Language')}</label>
				<FormControl fullWidth size="small">
					<Select
						id="instructor-language"
						displayEmpty
						value={search.language || ''}
						onChange={(e) => updateSearch({ language: (e.target.value as string) || undefined })}
					>
						<MenuItem value="">{t('All Languages')}</MenuItem>
						{LANGUAGES.map((lang) => (
							<MenuItem key={lang} value={lang}>
								{t(lang)}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'}>{t('Expertise')}</span>
				{EXPERTISE.map((tag) => (
					<FormControlLabel
						key={tag}
						control={
							<Checkbox
								size="small"
								checked={search.expertise?.includes(tag) ?? false}
								onChange={() => toggleExpertise(tag)}
							/>
						}
						label={t(tag)}
					/>
				))}
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'} id="instructor-rating-label">
					{t('Rating')}
				</span>
				<RadioGroup
					aria-labelledby="instructor-rating-label"
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
				<span className={'group-label'}>{t('Teaching Format')}</span>
				{FORMAT_OPTIONS.map((format) => (
					<FormControlLabel
						key={format}
						control={
							<Checkbox
								size="small"
								checked={search.teachingFormats?.includes(format) ?? false}
								onChange={() => toggleFormat(format)}
							/>
						}
						label={t(INSTRUCTOR_FORMAT_LABELS[format])}
					/>
				))}
			</div>

			<div className={'filter-group'}>
				<label htmlFor="instructor-availability">{t('Availability')}</label>
				<FormControl fullWidth size="small">
					<Select
						id="instructor-availability"
						displayEmpty
						value={search.availability || ''}
						onChange={(e) => updateSearch({ availability: (e.target.value as string) || undefined })}
					>
						<MenuItem value="">{t('Any Time')}</MenuItem>
						{AVAILABILITY.map((slot) => (
							<MenuItem key={slot} value={slot}>
								{t(slot)}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div className={'filter-group'}>
				<span className={'group-label'}>{t('Experience')}</span>
				{EXPERIENCE.map((option) => (
					<FormControlLabel
						key={option.value}
						control={
							<Checkbox
								size="small"
								checked={search.experienceRanges?.includes(option.value) ?? false}
								onChange={() => toggleExperience(option.value)}
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

export default InstructorFilter;
