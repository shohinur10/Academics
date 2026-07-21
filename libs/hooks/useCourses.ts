import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COURSES } from '../../apollo/user/query';
import { CoursesInquiry } from '../types/course/course.input';
import { Course } from '../types/course/course';
import { filterMockCourses, getMockCoursesTotal } from '../mock/courses.mock';

/**
 * Returns courses from GraphQL when backend is connected, otherwise falls back to mock data.
 */
export const useCourses = (input: CoursesInquiry) => {
	const { data, loading, error, refetch } = useQuery(GET_COURSES, {
		variables: { input },
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
	});

	const courses: Course[] = useMemo(() => {
		if (data?.getCourses?.list?.length) {
			return data.getCourses.list;
		}
		return filterMockCourses(input);
	}, [data, input]);

	const total = useMemo(() => {
		if (data?.getCourses?.metaCounter?.[0]?.total != null) {
			return data.getCourses.metaCounter[0].total;
		}
		return getMockCoursesTotal(input);
	}, [data, input]);

	return {
		courses,
		total,
		loading,
		error,
		refetch,
		isMock: !data?.getCourses?.list?.length,
	};
};

export default useCourses;
