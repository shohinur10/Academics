import React, { useState } from 'react';
import { Stack, Box, Button, FormControl, Select, MenuItem, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { CourseCategory, CourseLevel, CourseType } from '../../enums/course.enum';
import { CoursesInquiry } from '../../types/course/course.input';
import { Direction } from '../../enums/common.enum';

interface CourseFilterProps {
	searchFilter: CoursesInquiry;
	setSearchFilter: any;
	initialInput: CoursesInquiry;
}

const CourseFilter = (props: CourseFilterProps) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [localFilter, setLocalFilter] = useState<CoursesInquiry>(searchFilter || initialInput);

	const pushFilter = async (filter: CoursesInquiry) => {
		setSearchFilter(filter);
		await router.push(`/course?input=${JSON.stringify(filter)}`, `/course?input=${JSON.stringify(filter)}`, {
			scroll: false,
		});
	};

	const updateList = (key: 'categoryList' | 'levelList' | 'typeList', value: string) => {
		const next = {
			...localFilter,
			page: 1,
			search: {
				...localFilter.search,
				[key]: value ? [value] : undefined,
			},
		};
		setLocalFilter(next);
		pushFilter(next);
	};

	const resetHandler = async () => {
		setLocalFilter(initialInput);
		await pushFilter(initialInput);
	};

	if (device === 'mobile') {
		return <div>COURSE FILTER</div>;
	}

	return (
		<Stack className={'filter-main course-filter'}>
			<Typography className={'title'} variant="h6" sx={{ mb: 2 }}>
				Find Courses
			</Typography>
			<FormControl fullWidth sx={{ mb: 2 }}>
				<Select
					displayEmpty
					value={localFilter.search.categoryList?.[0] || ''}
					onChange={(e) => updateList('categoryList', e.target.value as string)}
				>
					<MenuItem value="">All Categories</MenuItem>
					{Object.values(CourseCategory).map((cat) => (
						<MenuItem key={cat} value={cat}>
							{cat}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ mb: 2 }}>
				<Select
					displayEmpty
					value={localFilter.search.levelList?.[0] || ''}
					onChange={(e) => updateList('levelList', e.target.value as string)}
				>
					<MenuItem value="">All Levels</MenuItem>
					{Object.values(CourseLevel).map((level) => (
						<MenuItem key={level} value={level}>
							{level}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ mb: 2 }}>
				<Select
					displayEmpty
					value={localFilter.search.typeList?.[0] || ''}
					onChange={(e) => updateList('typeList', e.target.value as string)}
				>
					<MenuItem value="">All Formats</MenuItem>
					{Object.values(CourseType).map((type) => (
						<MenuItem key={type} value={type}>
							{type}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Button variant="outlined" onClick={resetHandler}>
				Reset Filters
			</Button>
		</Stack>
	);
};

export default CourseFilter;
