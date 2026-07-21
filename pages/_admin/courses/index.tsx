import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Stack, Typography, Paper, TablePagination } from '@mui/material';
import { CoursePanelList } from '../../../libs/components/admin/courses/CourseList';
import { MOCK_COURSES } from '../../../libs/mock/courses.mock';
import { Course } from '../../../libs/types/course/course';
import { CourseStatus } from '../../../libs/enums/course.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';

const AdminCourses: NextPage = () => {
	const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = [...anchorEl] as any;
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const updateCourseHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Change status to ${status}?`)) {
				setCourses((prev) =>
					prev.map((c) => (c._id === id ? { ...c, courseStatus: status as CourseStatus } : c)),
				);
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const removeCourseHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Remove this course?')) {
				setCourses((prev) => prev.filter((c) => c._id !== id));
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	return (
		<Stack sx={{ p: 3 }}>
			<Typography variant="h5" sx={{ mb: 3 }}>
				Courses
			</Typography>
			<Paper>
				<CoursePanelList
					courses={courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
					anchorEl={anchorEl}
					menuIconClickHandler={menuIconClickHandler}
					menuIconCloseHandler={menuIconCloseHandler}
					updateCourseHandler={updateCourseHandler}
					removeCourseHandler={removeCourseHandler}
				/>
				<TablePagination
					component="div"
					count={courses.length}
					page={page}
					onPageChange={(_, newPage) => setPage(newPage)}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={(e) => {
						setRowsPerPage(parseInt(e.target.value, 10));
						setPage(0);
					}}
				/>
			</Paper>
			<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
				Showing mock data. Connect Academy backend GraphQL for live courses.
			</Typography>
		</Stack>
	);
};

export default withAdminLayout(AdminCourses);
