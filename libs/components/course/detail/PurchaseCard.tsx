import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import { Course } from '../../../types/course/course';
import { sweetTopSuccessAlert } from '../../../sweetAlert';
import PriceDisplay from '../PriceDisplay';

interface PurchaseCardProps {
	course: Course;
	onPreview: (course: Course) => void;
}

const PurchaseCard = ({ course, onPreview }: PurchaseCardProps) => {
	const { t } = useTranslation('common');
	const [wishlisted, setWishlisted] = useState(false);

	const poster = course.courseImages?.[0] || '/img/banner/header1.svg';
	const quizCount = course.courseSections?.reduce(
		(sum, section) => sum + section.lessons.filter((l) => l.type === 'QUIZ' || l.type === 'ASSIGNMENT').length,
		0,
	);
	const shareHandler = async () => {
		const url = window.location.href;
		if (navigator.share) {
			await navigator.share({ title: course.courseTitle, url }).catch(() => undefined);
		} else {
			await navigator.clipboard.writeText(url);
			await sweetTopSuccessAlert(t('Link copied to clipboard'));
		}
	};

	const includes = [
		{
			icon: <OndemandVideoOutlinedIcon />,
			text: `${course.courseVideoHours} ${t('hours on-demand video')}`,
			show: Boolean(course.courseVideoHours),
		},
		{ icon: <MenuBookOutlinedIcon />, text: `${course.courseLessons} ${t('Lessons')}`, show: true },
		{
			icon: <FileDownloadOutlinedIcon />,
			text: `${course.courseResourcesCount} ${t('downloadable resources')}`,
			show: Boolean(course.courseResourcesCount),
		},
		{
			icon: <QuizOutlinedIcon />,
			text: `${quizCount} ${t('quizzes and assignments')}`,
			show: Boolean(quizCount),
		},
		{ icon: <WorkspacePremiumOutlinedIcon />, text: t('Certificate of completion'), show: true },
		{ icon: <AllInclusiveOutlinedIcon />, text: t('Lifetime access'), show: true },
		{ icon: <PhoneIphoneOutlinedIcon />, text: t('Access on mobile and desktop'), show: true },
		{
			icon: <SubtitlesOutlinedIcon />,
			text: `${t('Subtitles')}: ${course.courseSubtitles?.join(', ')}`,
			show: Boolean(course.courseSubtitles?.length),
		},
	].filter((item) => item.show);

	return (
		<div className={'purchase-card'}>
			<button
				type="button"
				className={'purchase-media'}
				aria-label={`${t('Preview Lesson')}: ${course.courseTitle}`}
				onClick={() => onPreview(course)}
			>
				<img src={poster} alt={course.courseTitle} />
				<span className={'media-overlay'} aria-hidden="true" />
				<span className={'media-play'} aria-hidden="true">
					<PlayArrowRoundedIcon />
				</span>
				<span className={'media-caption'}>{t('Preview this course')}</span>
			</button>

			<div className={'purchase-body'}>
				<div className={'purchase-price'}>
					<PriceDisplay price={course.coursePrice} originalPrice={course.courseOriginalPrice} showDiscount />
				</div>

				<Link href={'/account/join'} className={'purchase-enroll-btn'}>
					{t('Enroll Now')}
				</Link>

				<div className={'purchase-secondary'}>
					<button
						type="button"
						className={`wishlist-toggle ${wishlisted ? 'on' : ''}`}
						aria-pressed={wishlisted}
						onClick={() => setWishlisted((prev) => !prev)}
					>
						{wishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						{t('Wishlist')}
					</button>
					<button type="button" className={'share-btn'} onClick={shareHandler}>
						<ShareOutlinedIcon />
						{t('Share')}
					</button>
				</div>

				<div className={'purchase-includes'}>
					<h3>{t('This course includes')}</h3>
					<ul>
						{includes.map((item) => (
							<li key={item.text}>
								{item.icon}
								{item.text}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default PurchaseCard;
