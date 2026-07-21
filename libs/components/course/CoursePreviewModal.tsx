import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Dialog, IconButton, useMediaQuery } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import { Course } from '../../types/course/course';
import { REACT_APP_API_URL } from '../../config';
import RatingDisplay from './RatingDisplay';

export interface CoursePreviewModalProps {
	isOpen: boolean;
	course: Course | null;
	onClose: () => void;
}

/**
 * Reusable course preview modal for the Courses module.
 * The <video> element only mounts while the dialog is open, so no players
 * are loaded on the listing page itself. MUI Dialog provides the focus trap,
 * focus restore to the trigger, Escape/backdrop closing, and body scroll lock.
 */
const CoursePreviewModal = ({ isOpen, course, onClose }: CoursePreviewModalProps) => {
	const { t } = useTranslation('common');
	const fullScreen = useMediaQuery('(max-width:767px)');
	const videoRef = useRef<HTMLVideoElement>(null);

	/** Stop playback whenever the modal closes (also covers Escape/backdrop). **/
	useEffect(() => {
		if (!isOpen) videoRef.current?.pause();
	}, [isOpen]);

	const closeHandler = () => {
		videoRef.current?.pause();
		onClose();
	};

	const poster = course?.courseImages?.[0] || '/img/banner/header1.svg';
	const instructorImage = course?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${course.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';
	const learnings = course?.courseLearnings?.slice(0, 5) ?? [];
	const detailHref = { pathname: '/course/detail', query: { id: course?._id } };

	return (
		<Dialog
			open={isOpen}
			onClose={closeHandler}
			className={'course-preview-modal'}
			maxWidth={false}
			fullScreen={fullScreen}
			aria-labelledby="course-preview-title"
		>
			{course && (
				<div className={'preview-inner'}>
					<div className={'preview-head'}>
						<span className={'preview-eyebrow'}>{t('Course Preview')}</span>
						<IconButton className={'preview-close'} aria-label={t('Close preview')} onClick={closeHandler}>
							<CloseOutlinedIcon />
						</IconButton>
					</div>

					<div className={'preview-body'}>
						<div className={'preview-media'}>
							{course.courseVideoUrl ? (
								/* eslint-disable-next-line jsx-a11y/media-has-caption */
								<video ref={videoRef} controls preload="metadata" playsInline poster={poster} src={course.courseVideoUrl} />
							) : (
								<div className={'video-fallback'}>
									<img src={poster} alt={course.courseTitle} />
									<div className={'fallback-message'}>
										<OndemandVideoOutlinedIcon />
										<p>{t('No preview available for this course yet.')}</p>
									</div>
								</div>
							)}
						</div>

						<div className={'preview-details'}>
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
						</div>
					</div>
				</div>
			)}
		</Dialog>
	);
};

export default CoursePreviewModal;
