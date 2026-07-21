import React, { useState } from 'react';
import { NextPage } from 'next';
import { Button, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CourseCategory, CourseLevel, CourseType } from '../../enums/course.enum';
import { CourseInput } from '../../types/course/course.input';
import { useRouter } from 'next/router';
import { sweetMixinSuccessAlert } from '../../sweetAlert';

const AddNewCourse: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [courseData, setCourseData] = useState<CourseInput>({
		courseType: CourseType.ONLINE,
		courseLevel: CourseLevel.BEGINNER,
		courseCategory: CourseCategory.ENGLISH,
		courseTitle: '',
		courseDesc: '',
		coursePrice: 0,
		courseDuration: 8,
		courseImages: [],
	});

	const createHandler = async () => {
		if (!courseData.courseTitle || !courseData.coursePrice) {
			return;
		}
		await sweetMixinSuccessAlert('Course saved locally (connect GraphQL to publish)');
		await router.push({ pathname: '/mypage', query: { category: 'myCourses' } });
	};

	if (device === 'mobile') {
		return <div>ADD NEW COURSE</div>;
	}

	return (
		<div id="add-property-page" className="add-course-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Create Course</Typography>
				<Typography className="sub-title">Add a new language course for students</Typography>
			</Stack>
			<Stack className="config" spacing={3} sx={{ maxWidth: 640 }}>
				<TextField
					label="Course Title"
					fullWidth
					value={courseData.courseTitle}
					onChange={(e) => setCourseData({ ...courseData, courseTitle: e.target.value })}
				/>
				<TextField
					label="Description"
					fullWidth
					multiline
					rows={4}
					value={courseData.courseDesc}
					onChange={(e) => setCourseData({ ...courseData, courseDesc: e.target.value })}
				/>
				<Select
					fullWidth
					value={courseData.courseCategory}
					onChange={(e) =>
						setCourseData({ ...courseData, courseCategory: e.target.value as CourseCategory })
					}
				>
					{Object.values(CourseCategory).map((cat) => (
						<MenuItem key={cat} value={cat}>
							{cat}
						</MenuItem>
					))}
				</Select>
				<Select
					fullWidth
					value={courseData.courseLevel}
					onChange={(e) => setCourseData({ ...courseData, courseLevel: e.target.value as CourseLevel })}
				>
					{Object.values(CourseLevel).map((level) => (
						<MenuItem key={level} value={level}>
							{level}
						</MenuItem>
					))}
				</Select>
				<Select
					fullWidth
					value={courseData.courseType}
					onChange={(e) => setCourseData({ ...courseData, courseType: e.target.value as CourseType })}
				>
					{Object.values(CourseType).map((type) => (
						<MenuItem key={type} value={type}>
							{type}
						</MenuItem>
					))}
				</Select>
				<TextField
					label="Price ($)"
					type="number"
					fullWidth
					value={courseData.coursePrice || ''}
					onChange={(e) => setCourseData({ ...courseData, coursePrice: Number(e.target.value) })}
				/>
				<TextField
					label="Duration (weeks)"
					type="number"
					fullWidth
					value={courseData.courseDuration || ''}
					onChange={(e) => setCourseData({ ...courseData, courseDuration: Number(e.target.value) })}
				/>
				<Button variant="contained" size="large" onClick={createHandler}>
					Create Course
				</Button>
			</Stack>
		</div>
	);
};

export default AddNewCourse;
