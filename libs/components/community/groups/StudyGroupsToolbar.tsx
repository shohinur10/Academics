import React from 'react';
import { useTranslation } from 'next-i18next';
import {
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Switch,
	FormControlLabel,
} from '@mui/material';
import {
	StudyGroupFilters,
	STUDY_GROUP_GOALS,
	STUDY_GROUP_LANGUAGES,
	STUDY_GROUP_LEVELS,
} from '../../../types/community/group';

interface StudyGroupsToolbarProps {
	filters: StudyGroupFilters;
	resultCount: number;
	onChange: (next: StudyGroupFilters) => void;
	onCreate: () => void;
}

const StudyGroupsToolbar = ({ filters, resultCount, onChange, onCreate }: StudyGroupsToolbarProps) => {
	const { t } = useTranslation('common');
	const patch = (partial: Partial<StudyGroupFilters>) => onChange({ ...filters, ...partial });

	return (
		<div className={'study-groups-toolbar'}>
			<div className={'toolbar-top'}>
				<div>
					<p className={'stub-eyebrow'}>{t('Study Groups')}</p>
					<h1>{t('Find your learning cohort')}</h1>
					<p className={'toolbar-lead'}>{t('Browse groups aligned with your language goals.')}</p>
				</div>
				<button type="button" className={'create-group-btn primary'} onClick={onCreate}>
					{t('Create Group')}
				</button>
			</div>

			<div className={'toolbar-search-row'}>
				<label className={'visually-hidden'} htmlFor="study-group-search">
					{t('Search study groups')}
				</label>
				<input
					id="study-group-search"
					type="search"
					value={filters.query}
					placeholder={t('Search by name, tag, or topic')}
					onChange={(e) => patch({ query: e.target.value })}
				/>
				<FormControl size="small" className={'sort-control'}>
					<InputLabel id="study-group-sort-label">{t('Sort')}</InputLabel>
					<Select
						labelId="study-group-sort-label"
						label={t('Sort')}
						value={filters.sort}
						onChange={(e) => patch({ sort: e.target.value as StudyGroupFilters['sort'] })}
					>
						<MenuItem value="members">{t('Most members')}</MenuItem>
						<MenuItem value="activity">{t('Activity')}</MenuItem>
						<MenuItem value="newest">{t('Recently active')}</MenuItem>
						<MenuItem value="name">{t('Name')}</MenuItem>
					</Select>
				</FormControl>
			</div>

			<div className={'toolbar-filters'} role="group" aria-label={t('Group filters')}>
				<FormControl size="small">
					<InputLabel id="filter-language">{t('Language')}</InputLabel>
					<Select
						labelId="filter-language"
						label={t('Language')}
						value={filters.language}
						onChange={(e) => patch({ language: e.target.value as StudyGroupFilters['language'] })}
					>
						<MenuItem value="all">{t('All languages')}</MenuItem>
						{STUDY_GROUP_LANGUAGES.map((lang) => (
							<MenuItem key={lang} value={lang}>
								{lang}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl size="small">
					<InputLabel id="filter-goal">{t('Goal')}</InputLabel>
					<Select
						labelId="filter-goal"
						label={t('Goal')}
						value={filters.goal}
						onChange={(e) => patch({ goal: e.target.value as StudyGroupFilters['goal'] })}
					>
						<MenuItem value="all">{t('All goals')}</MenuItem>
						{STUDY_GROUP_GOALS.map((goal) => (
							<MenuItem key={goal} value={goal}>
								{t(goal)}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl size="small">
					<InputLabel id="filter-level">{t('Level')}</InputLabel>
					<Select
						labelId="filter-level"
						label={t('Level')}
						value={filters.level}
						onChange={(e) => patch({ level: e.target.value as StudyGroupFilters['level'] })}
					>
						<MenuItem value="all">{t('All levels')}</MenuItem>
						{STUDY_GROUP_LEVELS.map((level) => (
							<MenuItem key={level} value={level}>
								{t(level)}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl size="small">
					<InputLabel id="filter-size">{t('Group size')}</InputLabel>
					<Select
						labelId="filter-size"
						label={t('Group size')}
						value={filters.size}
						onChange={(e) => patch({ size: e.target.value as StudyGroupFilters['size'] })}
					>
						<MenuItem value="all">{t('Any size')}</MenuItem>
						<MenuItem value="small">{t('Small')}</MenuItem>
						<MenuItem value="medium">{t('Medium')}</MenuItem>
						<MenuItem value="large">{t('Large')}</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small">
					<InputLabel id="filter-privacy">{t('Privacy')}</InputLabel>
					<Select
						labelId="filter-privacy"
						label={t('Privacy')}
						value={filters.privacy}
						onChange={(e) => patch({ privacy: e.target.value as StudyGroupFilters['privacy'] })}
					>
						<MenuItem value="all">{t('Public & private')}</MenuItem>
						<MenuItem value="public">{t('Public')}</MenuItem>
						<MenuItem value="private">{t('Private')}</MenuItem>
					</Select>
				</FormControl>

				<FormControlLabel
					control={
						<Switch
							checked={filters.activeRecently}
							onChange={(e) => patch({ activeRecently: e.target.checked })}
							inputProps={{ 'aria-label': t('Active recently') }}
						/>
					}
					label={t('Active recently')}
				/>
			</div>

			<p className={'result-count'} aria-live="polite">
				{resultCount} {t(resultCount === 1 ? 'group' : 'groups')}
			</p>
		</div>
	);
};

export default StudyGroupsToolbar;
