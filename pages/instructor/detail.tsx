import React, { useEffect, useState } from 'react';
import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getInstructorById } from '../../libs/mock/instructors.mock';
import { Member } from '../../libs/types/member/member';
import { MOCK_COURSES } from '../../libs/mock/courses.mock';
import CourseCard from '../../libs/components/homepage/CourseCard';
import StarIcon from '@mui/icons-material/Star';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const InstructorDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [instructor, setInstructor] = useState<Member | null>(null);

	useEffect(() => {
		if (router.query.id) {
			setInstructor(getInstructorById(router.query.id as string) ?? null);
		}
	}, [router.query.id]);

	if (!instructor) {
		return (
			<Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
				<Typography>Loading instructor...</Typography>
			</Stack>
		);
	}

	const instructorCourses = MOCK_COURSES.filter((c) => c.memberId === instructor._id);

	if (device === 'mobile') {
		return (
			<Stack sx={{ p: 2 }}>
				<Typography variant="h5">{instructor.memberNick}</Typography>
			</Stack>
		);
	}

	return (
		<Stack className={'agent-detail-page instructor-detail-page'} sx={{ py: 4 }}>
			<Stack className={'container'} direction="row" spacing={4}>
				<Stack alignItems="center" sx={{ minWidth: 280 }}>
					<Avatar
						src="/img/profile/defaultUser.svg"
						sx={{ width: 160, height: 160, mb: 2 }}
					/>
					<Typography variant="h5" fontWeight={600}>
						{instructor.memberNick}
					</Typography>
					<Chip label={instructor.memberType} sx={{ mt: 1 }} />
					<Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
						<StarIcon sx={{ fontSize: 18, color: '#f5a623' }} />
						<Typography>{instructor.memberRank}% rating</Typography>
					</Stack>
					<Divider sx={{ width: '100%', my: 2 }} />
					<Stack spacing={1} width="100%">
						<Typography><strong>{instructor.memberProperties}</strong> courses</Typography>
						<Typography><strong>{instructor.memberFollowers}</strong> followers</Typography>
						<Typography><strong>{instructor.memberViews}</strong> profile views</Typography>
					</Stack>
				</Stack>
				<Stack flex={1}>
					<Typography variant="h6" fontWeight={600}>
						About
					</Typography>
					<Typography sx={{ mt: 1, color: '#616161', lineHeight: 1.8 }}>
						{instructor.memberDesc}
					</Typography>
					<Divider sx={{ my: 3 }} />
					<Typography variant="h6" fontWeight={600}>
						Courses by {instructor.memberNick}
					</Typography>
					<Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mt: 2 }}>
						{instructorCourses.length === 0 ? (
							<Typography color="text.secondary">No courses yet.</Typography>
						) : (
							instructorCourses.map((course) => <CourseCard key={course._id} course={course} />)
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(InstructorDetail);
