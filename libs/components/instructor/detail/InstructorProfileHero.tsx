import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Member } from '../../../types/member/member';
import RatingDisplay from '../../course/RatingDisplay';
import { sweetTopSuccessAlert } from '../../../sweetAlert';
import { INSTRUCTOR_BADGE_LABELS, INSTRUCTOR_FORMAT_LABELS } from '../instructorPresentation';

interface InstructorProfileHeroProps {
	instructor: Member;
	onPlayIntro: () => void;
}

const InstructorProfileHero = ({ instructor, onPlayIntro }: InstructorProfileHeroProps) => {
	const { t } = useTranslation('common');
	const [following, setFollowing] = useState(false);
	const portrait = instructor.memberImage || '/img/profile/defaultUser.svg';
	const hasIntro = Boolean(instructor.memberIntroVideoUrl);

	const followHandler = async () => {
		setFollowing((prev) => !prev);
		await sweetTopSuccessAlert(following ? t('Unfollowed') : t('Following'));
	};

	/** Placeholder only — no messaging backend. */
	const messageHandler = async () => {
		await sweetTopSuccessAlert(t('Messaging will be available soon'));
	};

	return (
		<section className={'instructor-profile-hero'} aria-labelledby="instructor-profile-name">
			<div className={'profile-hero-card'}>
				{hasIntro ? (
					<button
						type="button"
						className={'profile-portrait'}
						aria-label={`${t('Play intro video')}: ${instructor.memberNick}`}
						onClick={onPlayIntro}
					>
						<img src={portrait} alt="" />
						<span className={'portrait-play'} aria-hidden="true">
							<PlayArrowRoundedIcon />
						</span>
					</button>
				) : (
					<div className={'profile-portrait is-static'}>
						<img src={portrait} alt={`${instructor.memberNick} portrait`} />
					</div>
				)}

				<div className={'profile-main'}>
					<div className={'profile-name-row'}>
						<h1 id="instructor-profile-name">{instructor.memberNick}</h1>
						{instructor.memberBadge && (
							<span className={`profile-badge badge-${instructor.memberBadge.toLowerCase()}`}>
								{t(INSTRUCTOR_BADGE_LABELS[instructor.memberBadge])}
							</span>
						)}
					</div>
					<p className={'profile-title'}>{instructor.memberTitle}</p>

					<div className={'profile-rating-row'}>
						<RatingDisplay
							rating={instructor.memberRating}
							count={instructor.memberReviewsCount}
							countSuffix={t('Reviews')}
						/>
					</div>

					<ul className={'profile-metrics'} aria-label={t('Instructor metrics')}>
						<li>
							<MenuBookOutlinedIcon />
							<strong>{instructor.memberProperties}</strong>
							<span>{t('Courses')}</span>
						</li>
						<li>
							<PeopleAltOutlinedIcon />
							<strong>{(instructor.memberStudents ?? 0).toLocaleString()}</strong>
							<span>{t('Students')}</span>
						</li>
						<li>
							<AccessTimeOutlinedIcon />
							<strong>{instructor.memberExperienceYears}+</strong>
							<span>{t('Years Experience')}</span>
						</li>
					</ul>

					<p className={'profile-summary'}>{instructor.memberDesc}</p>

					{instructor.memberExpertise?.length ? (
						<ul className={'profile-tags'}>
							{instructor.memberExpertise.map((tag) => (
								<li key={tag}>{t(tag)}</li>
							))}
						</ul>
					) : null}
				</div>

				<aside className={'profile-aside'}>
					<div className={'profile-actions'}>
						<button
							type="button"
							className={`follow-btn ${following ? 'on' : ''}`}
							aria-pressed={following}
							onClick={followHandler}
						>
							{following ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							{following ? t('Following') : t('Follow')}
						</button>
						<button type="button" className={'message-btn'} onClick={messageHandler}>
							<ChatBubbleOutlineRoundedIcon />
							{t('Message')}
						</button>
					</div>

					{instructor.memberTeachingFormats?.length ? (
						<div className={'availability-card'}>
							<h2>{t('Available for')}</h2>
							<ul>
								{instructor.memberTeachingFormats.map((format) => (
									<li key={format}>
										<CheckRoundedIcon aria-hidden="true" />
										{t(INSTRUCTOR_FORMAT_LABELS[format] ?? format)}
									</li>
								))}
							</ul>
						</div>
					) : null}
				</aside>
			</div>
		</section>
	);
};

export default InstructorProfileHero;
