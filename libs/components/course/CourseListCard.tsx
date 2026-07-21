import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Course } from '../../types/course/course';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { topCourseRank } from '../../config';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from '@mui/material/IconButton';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface CourseListCardProps {
	course: Course;
	likeCourseHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CourseListCard = (props: CourseListCardProps) => {
	const { course, likeCourseHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath = course?.courseImages?.[0] || '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>COURSE CARD</div>;
	}

	return (
		<Stack className="card-config">
			<Stack className="top">
				<Link
					href={{
						pathname: '/course/detail',
						query: { id: course?._id },
					}}
				>
					<img src={imagePath} alt={course.courseTitle} />
				</Link>
				{course?.courseRank > topCourseRank && (
					<Box component={'div'} className={'top-badge'}>
						<img src="/img/icons/electricity.svg" alt="" />
						<Typography>TOP</Typography>
					</Box>
				)}
				<Box component={'div'} className={'price-box'}>
					<Typography>${formatterStr(course?.coursePrice)}</Typography>
				</Box>
			</Stack>
			<Stack className="bottom">
				<Stack className="name-address">
					<Stack className="name">
						<Link
							href={{
								pathname: '/course/detail',
								query: { id: course?._id },
							}}
						>
							<Typography>{course.courseTitle}</Typography>
						</Link>
					</Stack>
					<Stack className="address">
						<Typography>
							{course.courseCategory} · {course.courseLevel} · {course.courseType}
						</Typography>
					</Stack>
				</Stack>
				<Stack className="options">
					<Stack className="option">
						<img src="/img/icons/room.svg" alt="" />{' '}
						<Typography>{course.courseLessons} lessons</Typography>
					</Stack>
					<Stack className="option">
						<img src="/img/icons/bed.svg" alt="" />{' '}
						<Typography>{course.courseDuration} weeks</Typography>
					</Stack>
					<Stack className="option">
						<img src="/img/icons/expand.svg" alt="" />{' '}
						<Typography>{course.courseStudents} students</Typography>
					</Stack>
				</Stack>
				<Stack className="divider"></Stack>
				<Stack className="type-buttons">
					<Stack className="type">
						<Typography sx={{ fontWeight: 500, fontSize: '13px' }}>
							{course.memberData?.memberNick ?? 'Instructor'}
						</Typography>
					</Stack>
					{!recentlyVisited && (
						<Stack className="buttons">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{course?.courseViews}</Typography>
							<IconButton
								color={'default'}
								onClick={() => likeCourseHandler?.(user, course?._id)}
							>
								{myFavorites || course?.meLiked?.[0]?.myFavorite ? (
									<FavoriteIcon color="primary" />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{course?.courseLikes}</Typography>
						</Stack>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CourseListCard;
