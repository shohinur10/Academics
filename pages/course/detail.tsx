import React, { useEffect, useState } from 'react';
import { Button, Chip, Divider, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getCourseById, MOCK_COURSES } from '../../libs/mock/courses.mock';
import { Course } from '../../libs/types/course/course';
import CourseCard from '../../libs/components/homepage/CourseCard';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CURRICULUM = [
	'Introduction & course overview',
	'Core vocabulary and grammar foundations',
	'Speaking practice with live sessions',
	'Listening comprehension exercises',
	'Writing assignments with feedback',
	'Final assessment and certificate',
];

const LEARNING_OUTCOMES = [
	'Hold confident conversations in your target language',
	'Understand grammar structures at your level',
	'Build practical vocabulary for real-life situations',
	'Receive a certificate upon completion',
];

const CourseDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [course, setCourse] = useState<Course | null>(null);
	const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);

	useEffect(() => {
		if (router.query.id) {
			const found = getCourseById(router.query.id as string);
			setCourse(found ?? null);
			if (found) {
				setRelatedCourses(
					MOCK_COURSES.filter(
						(c) => c._id !== found._id && c.courseCategory === found.courseCategory,
					).slice(0, 4),
				);
			}
		}
	}, [router.query.id]);

	if (!course) {
		return (
			<Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
				<Typography>Loading course...</Typography>
			</Stack>
		);
	}

	const imageUrl = course.courseImages?.[0] || '/img/banner/header1.svg';

	if (device === 'mobile') {
		return (
			<Stack sx={{ p: 2 }}>
				<Typography variant="h5">{course.courseTitle}</Typography>
				<Typography>${course.coursePrice}</Typography>
				<Button variant="contained" sx={{ mt: 2 }}>
					Enroll Now
				</Button>
			</Stack>
		);
	}

	return (
		<Stack className={'property-detail-page course-detail-page'}>
			<Stack className={'property-detail-config'}>
				<Stack className={'property-info-config'}>
					<Stack className={'info'} sx={{ width: '100%' }}>
						<Stack
							className={'main-image'}
							sx={{
								backgroundImage: `url(${imageUrl})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								height: 400,
								borderRadius: '12px',
								position: 'relative',
							}}
						>
							<Chip label={course.courseLevel} sx={{ position: 'absolute', top: 16, left: 16 }} />
							<Chip label={course.courseType} sx={{ position: 'absolute', top: 16, left: 120 }} />
						</Stack>
						<Stack sx={{ mt: 3 }}>
							<Typography variant="h4" fontWeight={600}>
								{course.courseTitle}
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
								<Typography color="text.secondary">
									by{' '}
									<Link href={`/instructor/detail?id=${course.memberId}`}>
										{course.memberData?.memberNick ?? 'Instructor'}
									</Link>
								</Typography>
								<Stack direction="row" alignItems="center" spacing={0.5}>
									<StarIcon sx={{ fontSize: 18, color: '#f5a623' }} />
									<Typography>{course.courseRank}% rating</Typography>
								</Stack>
							</Stack>
							<Typography sx={{ mt: 2, color: '#616161', lineHeight: 1.8 }}>{course.courseDesc}</Typography>
							<Stack direction="row" spacing={4} sx={{ mt: 3 }}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<MenuBookOutlinedIcon />
									<Typography>{course.courseLessons} lessons</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<AccessTimeOutlinedIcon />
									<Typography>{course.courseDuration} weeks</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<GroupsOutlinedIcon />
									<Typography>{course.courseStudents} students</Typography>
								</Stack>
							</Stack>
							<Divider sx={{ my: 3 }} />
							<Typography variant="h6" fontWeight={600}>
								What you&apos;ll learn
							</Typography>
							<Stack sx={{ mt: 1 }}>
								{LEARNING_OUTCOMES.map((item) => (
									<Typography key={item} sx={{ py: 0.5 }}>
										✓ {item}
									</Typography>
								))}
							</Stack>
							<Divider sx={{ my: 3 }} />
							<Typography variant="h6" fontWeight={600}>
								Curriculum
							</Typography>
							<Stack sx={{ mt: 1 }}>
								{CURRICULUM.map((lesson, i) => (
									<Stack key={lesson} direction="row" spacing={2} sx={{ py: 1 }}>
										<Typography color="text.secondary">Lesson {i + 1}</Typography>
										<Typography>{lesson}</Typography>
									</Stack>
								))}
							</Stack>
						</Stack>
					</Stack>
					<Stack className={'right-config'} sx={{ minWidth: 320 }}>
						<Stack
							sx={{
								p: 3,
								borderRadius: '12px',
								border: '1px solid #eee',
								position: 'sticky',
								top: 120,
							}}
						>
							<Typography variant="h4" fontWeight={700} color="primary">
								${course.coursePrice}
							</Typography>
							<Typography color="text.secondary" sx={{ mb: 2 }}>
								{course.courseDuration} weeks · {course.courseLessons} lessons
							</Typography>
							<Button variant="contained" fullWidth size="large" sx={{ mb: 1 }}>
								Enroll Now
							</Button>
							<Button variant="outlined" fullWidth size="large">
								Save for Later
							</Button>
							<Divider sx={{ my: 2 }} />
							<Typography variant="body2" color="text.secondary">
								Format: {course.courseType}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Level: {course.courseLevel}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Category: {course.courseCategory}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				{relatedCourses.length > 0 && (
					<Stack sx={{ mt: 6 }}>
						<Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
							Related Courses
						</Typography>
						<Stack direction="row" spacing={2} flexWrap="wrap">
							{relatedCourses.map((c) => (
								<CourseCard key={c._id} course={c} />
							))}
						</Stack>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutFull(CourseDetail);
