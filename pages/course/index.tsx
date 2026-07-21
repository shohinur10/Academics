import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CourseListCard from '../../libs/components/course/CourseListCard';
import CourseFilter from '../../libs/components/course/Filter';
import { filterMockCourses, getMockCoursesTotal } from '../../libs/mock/courses.mock';
import { CoursesInquiry } from '../../libs/types/course/course.input';
import { Direction } from '../../libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const defaultInput: CoursesInquiry = {
	page: 1,
	limit: 9,
	sort: 'courseRank',
	direction: Direction.DESC,
	search: {},
};

const CourseList: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>(
		router?.query?.input ? JSON.parse(router.query.input as string) : defaultInput,
	);
	const [courses, setCourses] = useState(filterMockCourses(searchFilter));
	const [total, setTotal] = useState(getMockCoursesTotal(searchFilter));
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router.query.input as string);
			setSearchFilter(inputObj);
			setCourses(filterMockCourses(inputObj));
			setTotal(getMockCoursesTotal(inputObj));
			setCurrentPage(inputObj.page || 1);
		} else {
			setCourses(filterMockCourses(searchFilter));
			setTotal(getMockCoursesTotal(searchFilter));
		}
	}, [router.query.input]);

	const handlePaginationChange = async (_: ChangeEvent<unknown>, value: number) => {
		const updated = { ...searchFilter, page: value };
		setSearchFilter(updated);
		setCourses(filterMockCourses(updated));
		setTotal(getMockCoursesTotal(updated));
		setCurrentPage(value);
		await router.push(`/course?input=${JSON.stringify(updated)}`, `/course?input=${JSON.stringify(updated)}`, {
			scroll: false,
		});
	};

	if (device === 'mobile') {
		return (
			<Stack sx={{ p: 2 }}>
				<Typography variant="h5">Courses</Typography>
				{courses.map((course) => (
					<CourseListCard key={course._id} course={course} />
				))}
			</Stack>
		);
	}

	return (
		<div id="property-page" className="course-page">
			<div className="container">
				<Stack className={'property-page'} direction="row" spacing={3}>
					<Stack className={'filter-config'}>
						<CourseFilter
							searchFilter={searchFilter}
							setSearchFilter={setSearchFilter}
							initialInput={defaultInput}
						/>
					</Stack>
					<Stack className={'main-config'} flex={1}>
						<Stack className={'list-config'}>
							<Stack className="cards-box" direction="row" flexWrap="wrap" gap={2}>
								{courses.length === 0 ? (
									<Box className={'empty-list'}>No courses found</Box>
								) : (
									courses.map((course) => <CourseListCard key={course._id} course={course} />)
								)}
							</Stack>
							{courses.length !== 0 && (
								<Stack className="pagination-config" sx={{ mt: 3 }}>
									<Pagination
										count={Math.ceil(total / searchFilter.limit) || 1}
										page={currentPage}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
									<Typography sx={{ mt: 1 }}>
										Total {total} course{total !== 1 ? 's' : ''} available
									</Typography>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(CourseList);
