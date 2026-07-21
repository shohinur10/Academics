import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Course } from '../../types/course/course';
import { REACT_APP_API_URL } from '../../config';
import RatingDisplay from './RatingDisplay';

interface FeaturedCourseCardProps {
	course: Course;
	onPreview: (course: Course) => void;
}

const FeaturedCourseCard = ({ course, onPreview }: FeaturedCourseCardProps) => {
	const { t } = useTranslation('common');
	const poster = course.courseImages?.[0] || '/img/banner/header1.svg';
	const instructorImage = course.memberData?.memberImage
		? `${REACT_APP_API_URL}/${course.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';

	return (
		<div className={'featured-course-card'}>
			<img className={'featured-poster'} src={poster} alt={course.courseTitle} />
			<div className={'featured-overlay'} aria-hidden="true" />

			<button
				type="button"
				className={'featured-play-btn'}
				aria-label={`${t('Preview Lesson')}: ${course.courseTitle}`}
				onClick={() => onPreview(course)}
			>
				<PlayArrowRoundedIcon />
			</button>

			<div className={'featured-content'}>
				<span className={'featured-label'}>{t('Featured Course')}</span>
				<h2 className={'featured-title'}>{course.courseTitle}</h2>
				<p className={'featured-meta'}>
					<span className={'level'}>{course.courseLevel.toLowerCase()}</span>
					<span aria-hidden="true">•</span>
					<span>
						{course.courseDuration} {t('Weeks')}
					</span>
					<span aria-hidden="true">•</span>
					<span>
						{course.courseLessons} {t('Lessons')}
					</span>
				</p>
				<div className={'featured-stats'}>
					<span className={'instructor'}>
						<img src={instructorImage} alt={course.memberData?.memberNick ?? 'instructor'} />
						{course.memberData?.memberNick}
					</span>
					<span className={'students'}>
						<PeopleAltOutlinedIcon />
						{course.courseStudents} {t('Students')}
					</span>
					<RatingDisplay rating={course.courseRating} count={course.courseReviewsCount} />
				</div>
				<div className={'featured-actions'}>
					<button type="button" className={'featured-preview-btn'} onClick={() => onPreview(course)}>
						<PlayArrowRoundedIcon />
						{t('Preview Lesson')}
					</button>
					<Link href={{ pathname: '/course/detail', query: { id: course._id } }} className={'featured-details-btn'}>
						{t('View Details')}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default FeaturedCourseCard;
