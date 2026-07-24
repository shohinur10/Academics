import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { Member } from '../../types/member/member';
import RatingDisplay from '../course/RatingDisplay';
import { INSTRUCTOR_BADGE_LABELS } from './instructorPresentation';

interface InstructorCatalogCardProps {
	instructor: Member;
}

const InstructorCatalogCard = ({ instructor }: InstructorCatalogCardProps) => {
	const { t } = useTranslation('common');
	const [wishlisted, setWishlisted] = useState(false);

	const detailHref = { pathname: '/instructor/detail', query: { id: instructor._id } };
	const portrait = instructor.memberImage || '/img/profile/defaultUser.svg';
	const tags = instructor.memberExpertise?.slice(0, 3) ?? [];

	return (
		<article className={'instructor-catalog-card'}>
			<div className={'card-media'}>
				<Link href={detailHref}>
					<img src={portrait} alt={`${instructor.memberNick} portrait`} loading="lazy" />
				</Link>
				{instructor.memberBadge && (
					<span className={`badge badge-${instructor.memberBadge.toLowerCase()}`}>
						{t(INSTRUCTOR_BADGE_LABELS[instructor.memberBadge])}
					</span>
				)}
				<button
					type="button"
					className={`wishlist-btn ${wishlisted ? 'on' : ''}`}
					aria-label={t('Save instructor')}
					aria-pressed={wishlisted}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						setWishlisted((prev) => !prev);
					}}
				>
					{wishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</button>
			</div>

			<div className={'card-body'}>
				<Link href={detailHref}>
					<h3 className={'card-title'}>{instructor.memberNick}</h3>
				</Link>
				<p className={'card-specialization'}>{instructor.memberTitle}</p>

				<div className={'card-stats'}>
					<RatingDisplay rating={instructor.memberRating} count={instructor.memberReviewsCount} />
					<span>
						<MenuBookOutlinedIcon />
						{instructor.memberProperties} {t('Courses')}
					</span>
					<span>
						<PeopleAltOutlinedIcon />
						{(instructor.memberStudents ?? 0).toLocaleString()}
					</span>
				</div>

				{tags.length !== 0 && (
					<ul className={'card-tags'}>
						{tags.map((tag) => (
							<li key={tag}>{t(tag)}</li>
						))}
					</ul>
				)}

				<p className={'card-bio'}>{instructor.memberDesc}</p>

				<div className={'card-meta'}>
					{instructor.memberExperienceYears !== undefined && (
						<span>
							<AccessTimeOutlinedIcon />
							{instructor.memberExperienceYears}+ {t('Years')}
						</span>
					)}
					{instructor.memberLanguages?.length ? (
						<span className={'languages'}>{instructor.memberLanguages.join(' · ')}</span>
					) : null}
				</div>

				<Link href={detailHref} className={'profile-btn'}>
					{t('View Profile')}
				</Link>
			</div>
		</article>
	);
};

export default InstructorCatalogCard;
