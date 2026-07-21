import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { MyCourseCard } from '../mypage/MyCourseCard';
import { filterMockCourses } from '../../mock/courses.mock';
import { Direction } from '../../enums/common.enum';
import { useRouter } from 'next/router';

const MemberCourses: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const memberId = router.query.memberId as string;

	const courses = useMemo(
		() =>
			filterMockCourses({
				page: 1,
				limit: 12,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: memberId ? { memberId } : {},
			}),
		[memberId],
	);

	if (device === 'mobile') {
		return <div>MEMBER COURSES</div>;
	}

	return (
		<div id="member-property-page" className="member-courses-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Courses</Typography>
			</Stack>
			<Stack className="property-list-box">
				{courses.length === 0 ? (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No courses found!</p>
					</div>
				) : (
					courses.map((course) => <MyCourseCard key={course._id} course={course} memberPage />)
				)}
			</Stack>
		</div>
	);
};

export default MemberCourses;
