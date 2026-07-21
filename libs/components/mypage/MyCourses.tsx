import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { MyCourseCard } from './MyCourseCard';
import { Course } from '../../types/course/course';
import { InstructorCoursesInquiry } from '../../types/course/course.input';
import { CourseStatus } from '../../enums/course.enum';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { filterMockCourses } from '../../mock/courses.mock';
import { Direction } from '../../enums/common.enum';
import { T } from '../../types/common';

const MyCourses: NextPage = ({ initialInput }: any) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<InstructorCoursesInquiry>(initialInput);
	const [status, setStatus] = useState<CourseStatus | 'ALL'>('ALL');

	const courses = useMemo(() => {
		const list = filterMockCourses({
			page: searchFilter.page,
			limit: searchFilter.limit,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {},
		}).filter((c) => c.memberId === user?._id || true);
		if (status === 'ALL') return list;
		return list.filter((c) => c.courseStatus === status);
	}, [searchFilter, status, user?._id]);

	const paginationHandler = (_: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>MY COURSES</div>;
	}

	return (
		<div id="my-property-page" className="my-courses-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">My Courses</Typography>
					<Typography className="sub-title">Manage your published courses</Typography>
				</Stack>
			</Stack>
			<Stack className="property-list-box">
				<Stack className="tab-name-box">
					<Typography
						onClick={() => setStatus('ALL')}
						className={status === 'ALL' ? 'active-tab-name' : 'tab-name'}
					>
						All
					</Typography>
					<Typography
						onClick={() => setStatus(CourseStatus.ACTIVE)}
						className={status === CourseStatus.ACTIVE ? 'active-tab-name' : 'tab-name'}
					>
						Active
					</Typography>
					<Typography
						onClick={() => setStatus(CourseStatus.DRAFT)}
						className={status === CourseStatus.DRAFT ? 'active-tab-name' : 'tab-name'}
					>
						Draft
					</Typography>
					<Typography
						onClick={() => setStatus(CourseStatus.CLOSED)}
						className={status === CourseStatus.CLOSED ? 'active-tab-name' : 'tab-name'}
					>
						Closed
					</Typography>
				</Stack>
				<Stack className="list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">Title</Typography>
						<Typography className="title-text">Date</Typography>
						<Typography className="title-text">Status</Typography>
						<Typography className="title-text">View</Typography>
					</Stack>
					{courses.length === 0 ? (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No courses found!</p>
						</div>
					) : (
						courses.map((course: Course) => <MyCourseCard key={course._id} course={course} />)
					)}
				</Stack>
			</Stack>
			{courses.length > 0 && (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(courses.length / searchFilter.limit) || 1}
							page={searchFilter.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>Total {courses.length} course(s)</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MyCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {},
	},
};

export default MyCourses;
