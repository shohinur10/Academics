import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { Course } from '../../../types/course/course';
import { MOCK_COURSES } from '../../../mock/courses.mock';
import { REACT_APP_API_URL } from '../../../config';

interface InstructorCardProps {
	course: Course;
}

const InstructorCard = ({ course }: InstructorCardProps) => {
	const { t } = useTranslation('common');
	const instructor = course.memberData;
	if (!instructor) return null;

	const instructorCourses = MOCK_COURSES.filter((c) => c.memberId === course.memberId);
	const totalStudents = instructorCourses.reduce((sum, c) => sum + c.courseStudents, 0);
	const totalReviews = instructorCourses.reduce((sum, c) => sum + (c.courseReviewsCount ?? 0), 0);
	const avgRating =
		instructorCourses.reduce((sum, c) => sum + (c.courseRating ?? 0), 0) / (instructorCourses.length || 1);
	const photo = instructor.memberImage
		? `${REACT_APP_API_URL}/${instructor.memberImage}`
		: '/img/profile/agent.png';

	return (
		<div className={'instructor-profile-card'}>
			<div className={'instructor-main'}>
				<img src={photo} alt={`${instructor.memberNick} portrait`} loading="lazy" />
				<div className={'instructor-headline'}>
					<h3>{instructor.memberNick}</h3>
					<p>{instructor.memberDesc}</p>
				</div>
			</div>

			<ul className={'instructor-stats'}>
				<li>
					<StarRoundedIcon />
					{avgRating.toFixed(1)} {t('Instructor rating')}
				</li>
				<li>
					<RateReviewOutlinedIcon />
					{totalReviews} {t('Reviews')}
				</li>
				<li>
					<PeopleAltOutlinedIcon />
					{totalStudents} {t('Students')}
				</li>
				<li>
					<PlayCircleOutlineRoundedIcon />
					{instructorCourses.length} {t('Courses')}
				</li>
			</ul>

			<Link href={{ pathname: '/instructor/detail', query: { id: course.memberId } }} className={'instructor-profile-btn'}>
				{t('View Profile')}
			</Link>
		</div>
	);
};

export default InstructorCard;
