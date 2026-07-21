import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CourseListCard from '../course/CourseListCard';
import { filterMockCourses } from '../../mock/courses.mock';
import { Direction } from '../../enums/common.enum';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const courses = useMemo(
		() =>
			filterMockCourses({
				page: 1,
				limit: 6,
				sort: 'courseViews',
				direction: Direction.DESC,
				search: {},
			}),
		[],
	);

	if (device === 'mobile') {
		return <div>RECENTLY VIEWED</div>;
	}

	return (
		<div id="my-favorites-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Recently Viewed</Typography>
				<Typography className="sub-title">Courses you recently looked at</Typography>
			</Stack>
			<Stack className="favorites-list-box" direction="row" flexWrap="wrap" gap={2}>
				{courses.length === 0 ? (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No recently viewed courses!</p>
					</div>
				) : (
					courses.map((course) => (
						<CourseListCard key={course._id} course={course} recentlyVisited={true} />
					))
				)}
			</Stack>
		</div>
	);
};

export default RecentlyVisited;
