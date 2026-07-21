import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { Course } from '../../types/course/course';
import { REACT_APP_API_URL } from '../../config';
import RatingDisplay from './RatingDisplay';
import PriceDisplay from './PriceDisplay';

interface CourseCatalogCardProps {
	course: Course;
	onPreview?: (course: Course) => void;
}

const CourseCatalogCard = ({ course, onPreview }: CourseCatalogCardProps) => {
	const { t } = useTranslation('common');
	const [wishlisted, setWishlisted] = useState(false);

	const detailHref = { pathname: '/course/detail', query: { id: course._id } };
	const thumbnail = course.courseImages?.[0] || '/img/banner/header1.svg';
	const instructorImage = course.memberData?.memberImage
		? `${REACT_APP_API_URL}/${course.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';

	return (
		<article className={'catalog-card'}>
			<div className={'card-media'}>
				<Link href={detailHref}>
					<img src={thumbnail} alt={course.courseTitle} loading="lazy" />
				</Link>
				{course.coursePreviewDuration && <span className={'duration-badge'}>▶ {course.coursePreviewDuration}</span>}
				<button
					type="button"
					className={`wishlist-btn ${wishlisted ? 'on' : ''}`}
					aria-label={t('Add to wishlist')}
					aria-pressed={wishlisted}
					onClick={() => setWishlisted((prev) => !prev)}
				>
					{wishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</button>
				{onPreview && (
					<button
						type="button"
						className={'preview-overlay-btn'}
						aria-label={`${t('Preview Lesson')}: ${course.courseTitle}`}
						onClick={() => onPreview(course)}
					>
						<PlayArrowRoundedIcon />
					</button>
				)}
			</div>

			<div className={'card-body'}>
				<Link href={detailHref}>
					<h3 className={'card-title'}>{course.courseTitle}</h3>
				</Link>
				<div className={'card-meta-top'}>
					<span className={'level'}>{course.courseLevel.toLowerCase()}</span>
					<span className={'dot'} aria-hidden="true">
						•
					</span>
					<span>
						{course.courseDuration} {t('Weeks')}
					</span>
				</div>
				<div className={'card-instructor'}>
					<img src={instructorImage} alt={course.memberData?.memberNick ?? 'instructor'} loading="lazy" />
					<span>{course.memberData?.memberNick}</span>
				</div>
				<div className={'card-stats'}>
					<RatingDisplay rating={course.courseRating} count={course.courseReviewsCount} />
					<span>
						<PeopleAltOutlinedIcon />
						{course.courseStudents}
					</span>
					<span>
						<MenuBookOutlinedIcon />
						{course.courseLessons}
					</span>
				</div>
				<div className={'card-footer'}>
					<PriceDisplay price={course.coursePrice} originalPrice={course.courseOriginalPrice} />
					<Link href={detailHref} className={'enroll-btn'}>
						{t('Enroll Now')}
					</Link>
				</div>
			</div>
		</article>
	);
};

export default CourseCatalogCard;
