import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CourseListCard from '../course/CourseListCard';
import { filterMockCourses } from '../../mock/courses.mock';
import { Direction } from '../../enums/common.enum';

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const courses = useMemo(
		() =>
			filterMockCourses({
				page: 1,
				limit: 6,
				sort: 'courseLikes',
				direction: Direction.DESC,
				search: {},
			}),
		[],
	);

	if (device === 'mobile') {
		return <div>MY FAVORITES</div>;
	}

	return (
		<div id="my-favorites-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Saved Courses</Typography>
				<Typography className="sub-title">Courses you liked and saved</Typography>
			</Stack>
			<Stack className="favorites-list-box" direction="row" flexWrap="wrap" gap={2}>
				{courses.length === 0 ? (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No saved courses yet!</p>
					</div>
				) : (
					courses.map((course) => (
						<CourseListCard key={course._id} course={course} myFavorites={true} />
					))
				)}
			</Stack>
		</div>
	);
};

export default MyFavorites;
