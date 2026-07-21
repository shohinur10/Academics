import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import { Course } from '../../../types/course/course';
import { CourseStatus } from '../../../enums/course.enum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';

interface CoursePanelListProps {
	courses: Course[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateCourseHandler: any;
	removeCourseHandler: any;
}

export const CoursePanelList = (props: CoursePanelListProps) => {
	const {
		courses,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateCourseHandler,
		removeCourseHandler,
	} = props;

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Title</TableCell>
					<TableCell>Category</TableCell>
					<TableCell>Level</TableCell>
					<TableCell>Type</TableCell>
					<TableCell>Price</TableCell>
					<TableCell>Students</TableCell>
					<TableCell>Status</TableCell>
					<TableCell>Actions</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{courses.map((course: Course, index: number) => (
					<TableRow key={course._id}>
						<TableCell>
							<Link href={`/course/detail?id=${course._id}`}>
								<Typography sx={{ cursor: 'pointer', fontWeight: 500 }}>{course.courseTitle}</Typography>
							</Link>
						</TableCell>
						<TableCell>{course.courseCategory}</TableCell>
						<TableCell>{course.courseLevel}</TableCell>
						<TableCell>{course.courseType}</TableCell>
						<TableCell>${course.coursePrice}</TableCell>
						<TableCell>{course.courseStudents}</TableCell>
						<TableCell>
							<Chip label={course.courseStatus} size="small" />
						</TableCell>
						<TableCell>
							<IconButton onClick={(e) => menuIconClickHandler(e, index)}>
								<MoreVertIcon />
							</IconButton>
							<Menu
								anchorEl={anchorEl[index]}
								open={Boolean(anchorEl[index])}
								onClose={menuIconCloseHandler}
							>
								{Object.values(CourseStatus)
									.filter((s) => s !== course.courseStatus)
									.map((status) => (
										<MenuItem
											key={status}
											onClick={() => {
												updateCourseHandler(status, course._id);
												menuIconCloseHandler();
											}}
										>
											Set {status}
										</MenuItem>
									))}
								<MenuItem
									onClick={() => {
										removeCourseHandler(course._id);
										menuIconCloseHandler();
									}}
								>
									Remove
								</MenuItem>
							</Menu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default CoursePanelList;
