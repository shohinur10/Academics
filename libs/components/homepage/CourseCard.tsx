import React from 'react';
import { Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Course } from '../../types/course/course';
import { useRouter } from 'next/router';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

interface CourseCardProps {
	course: Course;
	likeHandler?: (id: string) => void;
}

const CourseCard = (props: CourseCardProps) => {
	const { course, likeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const pushDetailHandler = async (courseId: string) => {
		await router.push({ pathname: '/course/detail', query: { id: courseId } });
	};

	const imageUrl = course.courseImages?.[0] || '/img/banner/header1.svg';

	return (
		<div className="academy-course-card" key={course._id}>
			<div className="card-media" onClick={() => pushDetailHandler(course._id)}>
				<img src={imageUrl} alt={course.courseTitle} />
				<span className="price-tag">${course.coursePrice}</span>
				<span className="level-tag">{course.courseLevel}</span>
			</div>
			<div className="card-body">
				<strong className="card-title" onClick={() => pushDetailHandler(course._id)}>
					{course.courseTitle}
				</strong>
				<p className="card-desc">{course.courseDesc ?? 'No description'}</p>
				<div className="card-meta">
					<span>
						<MenuBookOutlinedIcon sx={{ fontSize: 15 }} />
						{course.courseLessons} lessons
					</span>
					<span>
						<AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />
						{course.courseDuration} weeks
					</span>
					<span className="format">{course.courseType}</span>
				</div>
				<div className="card-footer">
					<p className="instructor">{course.memberData?.memberNick ?? 'Instructor'}</p>
					<div className="view-like-box">
						<RemoveRedEyeIcon sx={{ fontSize: 17 }} />
						<Typography className="cnt">{course.courseViews}</Typography>
						<IconButton size="small" onClick={() => likeHandler?.(course._id)}>
							{course.meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon sx={{ fontSize: 17, color: '#eb6753' }} />
							) : (
								<FavoriteBorderIcon sx={{ fontSize: 17 }} />
							)}
						</IconButton>
						<Typography className="cnt">{course.courseLikes}</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
