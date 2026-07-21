import React, { useState } from 'react';
import { Stack, Box, Button, FormControl, Select, MenuItem } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { CourseCategory, CourseLevel, CourseType } from '../../enums/course.enum';
import { CoursesInquiry } from '../../types/course/course.input';
import { Direction } from '../../enums/common.enum';

const defaultInput: CoursesInquiry = {
	page: 1,
	limit: 12,
	sort: 'courseRank',
	direction: Direction.DESC,
	search: {},
};

const CourseSearchFilter = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>(defaultInput);

	const handleSearch = async () => {
		await router.push(`/course?input=${JSON.stringify(searchFilter)}`, `/course?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
	};

	const updateSearch = (key: string, value: any) => {
		setSearchFilter((prev) => ({
			...prev,
			search: {
				...prev.search,
				[key]: value ? [value] : undefined,
			},
		}));
	};

	if (device === 'mobile') {
		return (
			<Stack className={'course-search-filter mobile'} sx={{ px: 2, pb: 2 }}>
				<Button variant="contained" fullWidth onClick={handleSearch}>
					{t('Course Search')}
				</Button>
			</Stack>
		);
	}

	return (
		<Stack className={'course-search-filter'}>
			<Stack className={'filter-main'} direction="row" spacing={2} alignItems="center">
				<FormControl className={'filter-field'}>
					<Select
						displayEmpty
						value={searchFilter.search.categoryList?.[0] || ''}
						onChange={(e) => updateSearch('categoryList', e.target.value)}
					>
						<MenuItem value="">{t('Category')}</MenuItem>
						{Object.values(CourseCategory).map((cat) => (
							<MenuItem key={cat} value={cat}>
								{cat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl className={'filter-field'}>
					<Select
						displayEmpty
						value={searchFilter.search.levelList?.[0] || ''}
						onChange={(e) => updateSearch('levelList', e.target.value)}
					>
						<MenuItem value="">{t('Level')}</MenuItem>
						{Object.values(CourseLevel).map((level) => (
							<MenuItem key={level} value={level}>
								{level}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl className={'filter-field'}>
					<Select
						displayEmpty
						value={searchFilter.search.typeList?.[0] || ''}
						onChange={(e) => updateSearch('typeList', e.target.value)}
					>
						<MenuItem value="">{t('Format')}</MenuItem>
						{Object.values(CourseType).map((type) => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Box>
					<Button variant="contained" className={'search-btn'} onClick={handleSearch}>
						{t('Course Search')}
					</Button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default CourseSearchFilter;
