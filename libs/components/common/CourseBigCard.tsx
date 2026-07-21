import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Course } from '../../types/course/course';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { topCourseRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface CourseBigCardProps {
	course: Course;
	likeCourseHandler?: any;
}

const CourseBigCard = (props: CourseBigCardProps) => {
	const { course, likeCourseHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath = course?.courseImages?.[0] || '/img/banner/header1.svg';

	const pushDetailHandler = async (courseId: string) => {
		await router.push({ pathname: '/course/detail', query: { id: courseId } });
	};

	if (device === 'mobile') {
		return <div>COURSE BIG CARD</div>;
	}

	return (
		<Stack className="property-big-card-box course-big-card" onClick={() => pushDetailHandler(course._id)}>
			<Box
				component={'div'}
				className={'card-img'}
				style={{ backgroundImage: `url(${imagePath})` }}
			>
				{course && course?.courseRank >= topCourseRank && (
					<div className={'status'}>
						<img src="/img/icons/electricity.svg" alt="" />
						<span>TOP</span>
					</div>
				)}
				<div>${course?.coursePrice}</div>
			</Box>
			<Box component={'div'} className={'info'}>
				<strong className={'title'}>{course?.courseTitle}</strong>
				<p className={'desc'}>{course?.courseDesc ?? 'no description'}</p>
				<div className={'options'}>
					<div>
						<img src="/img/icons/bed.svg" alt="" />
						<span>{course?.courseLessons} lessons</span>
					</div>
					<div>
						<img src="/img/icons/room.svg" alt="" />
						<span>{course?.courseDuration} weeks</span>
					</div>
					<div>
						<img src="/img/icons/expand.svg" alt="" />
						<span>{course?.courseStudents} students</span>
					</div>
				</div>
				<Divider sx={{ mt: '15px', mb: '17px' }} />
				<div className={'bott'}>
					<p>
						{course?.courseType} · {course?.courseLevel}
					</p>
					<div className="view-like-box">
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{course?.courseViews}</Typography>
						<IconButton
							color={'default'}
							onClick={(e) => {
								e.stopPropagation();
								likeCourseHandler?.(user, course?._id);
							}}
						>
							{course?.meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: 'red' }} />
							) : (
								<FavoriteIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{course?.courseLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default CourseBigCard;
