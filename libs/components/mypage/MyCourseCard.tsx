import React from 'react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Course } from '../../types/course/course';
import { CourseStatus } from '../../enums/course.enum';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MyCourseCardProps {
	course: Course;
	deleteCourseHandler?: any;
	updateCourseHandler?: any;
	memberPage?: boolean;
}

export const MyCourseCard = (props: MyCourseCardProps) => {
	const { course, deleteCourseHandler, updateCourseHandler, memberPage } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const imagePath = course?.courseImages?.[0] || '/img/banner/header1.svg';

	const pushDetailHandler = async (courseId: string) => {
		await router.push({ pathname: '/course/detail', query: { id: courseId } });
	};

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MY COURSE CARD</div>;
	}

	return (
		<Stack className="property-card-box course-card-box">
			<Stack className="image-box" onClick={() => pushDetailHandler(course._id)}>
				<img src={imagePath} alt="" />
			</Stack>
			<Stack className="information-box" onClick={() => pushDetailHandler(course._id)}>
				<Typography className="name">{course.courseTitle}</Typography>
				<Typography className="address">
					{course.courseCategory} · {course.courseLevel}
				</Typography>
				<Typography className="price">
					<strong>${course.coursePrice}</strong>
				</Typography>
			</Stack>
			<Stack className="date-box">
				<Typography className="date">{new Date(course.createdAt).toLocaleDateString()}</Typography>
			</Stack>
			<Stack className="status-box">
				<Typography className="status">{course.courseStatus}</Typography>
			</Stack>
			<Stack className="views-box">
				<Typography className="views">{course.courseViews} views</Typography>
			</Stack>
			{!memberPage && (
				<Stack className="buttons-box">
					<IconButton onClick={handleMenuClick}>
						<MoreVertIcon />
					</IconButton>
					<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
						{course.courseStatus === CourseStatus.ACTIVE && (
							<MenuItem
								onClick={() => {
									updateCourseHandler?.(CourseStatus.CLOSED, course._id);
									handleClose();
								}}
							>
								Close
							</MenuItem>
						)}
						<MenuItem
							onClick={() => {
								deleteCourseHandler?.(course._id);
								handleClose();
							}}
						>
							Delete
						</MenuItem>
					</Menu>
				</Stack>
			)}
		</Stack>
	);
};

export default MyCourseCard;
