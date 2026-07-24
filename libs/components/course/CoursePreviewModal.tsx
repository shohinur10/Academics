import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Course } from '../../types/course/course';
import { REACT_APP_API_URL } from '../../config';
import RatingDisplay from './RatingDisplay';
import BaseVideoModal from '../common/BaseVideoModal';

export interface CoursePreviewModalProps {
	isOpen: boolean;
	course: Course | null;
	onClose: () => void;
}

const resolveImage = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

/**
 * Course preview modal — domain wrapper around BaseVideoModal.
 */
const CoursePreviewModal = ({ isOpen, course, onClose }: CoursePreviewModalProps) => {
	const { t } = useTranslation('common');

	if (!course) return null;

	const poster = course.courseImages?.[0] || '/img/banner/header1.svg';
	const instructorImage = resolveImage(course.memberData?.memberImage);
	const learnings = course.courseLearnings?.slice(0, 5) ?? [];
	const detailHref = { pathname: '/course/detail', query: { id: course._id } };

	return (
		<BaseVideoModal
			isOpen={isOpen}
			onClose={onClose}
			titleId="course-preview-title"
			eyebrow={t('Course Preview')}
			posterUrl={poster}
			videoUrl={course.courseVideoUrl}
			fallbackMessage={t('No preview available for this course yet.')}
			className="course-preview-modal"
		>
			<h2 id="course-preview-title" className={'preview-title'}>
				{course.courseTitle}
			</h2>

			<div className={'preview-instructor'}>
				<img src={instructorImage} alt={course.memberData?.memberNick ?? 'instructor'} />
				<span>{course.memberData?.memberNick}</span>
			</div>

			<div className={'preview-stats'}>
				<RatingDisplay rating={course.courseRating} count={course.courseReviewsCount} />
				<span>
					<PeopleAltOutlinedIcon />
					{course.courseStudents} {t('Students')}
				</span>
			</div>

			<div className={'preview-chips'}>
				<span className={'chip level'}>{course.courseLevel.toLowerCase()}</span>
				<span className={'chip'}>
					<ScheduleOutlinedIcon />
					{course.courseDuration} {t('Weeks')}
				</span>
				<span className={'chip'}>
					<MenuBookOutlinedIcon />
					{course.courseLessons} {t('Lessons')}
				</span>
			</div>

			<p className={'preview-desc'}>{course.courseDesc}</p>

			{learnings.length !== 0 && (
				<div className={'preview-learnings'}>
					<h3>{t('What you will learn')}</h3>
					<ul>
						{learnings.map((item) => (
							<li key={item}>
								<CheckRoundedIcon aria-hidden="true" />
								{item}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className={'preview-actions'}>
				<Link href={detailHref} className={'view-course-btn'}>
					{t('View Full Course')}
				</Link>
				<Link href={detailHref} className={'enroll-btn'}>
					{t('Enroll Now')} — ${course.coursePrice}
				</Link>
			</div>
		</BaseVideoModal>
	);
};

export default CoursePreviewModal;
