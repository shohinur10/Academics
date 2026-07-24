import React from 'react';
import { useTranslation } from 'next-i18next';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { MOCK_INSTRUCTORS } from '../../mock/instructors.mock';

const HERO_STATS = [
	{ value: '50+', label: 'Expert Instructors' },
	{ value: '500+', label: 'Courses' },
	{ value: '18,000+', label: 'Students' },
	{ value: '4.9', label: 'Average Rating' },
];

/** Collage portraits — use mock instructor images (placeholders until real photos land). */
const COLLAGE_IMAGES = MOCK_INSTRUCTORS.slice(0, 5).map((instructor, index) => ({
	src: instructor.memberImage || '/img/profile/defaultUser.svg',
	alt: `${instructor.memberNick} portrait`,
	className: `collage-shot shot-${index + 1}`,
}));

const InstructorSearchHero = () => {
	const { t } = useTranslation('common');

	return (
		<section className={'instructor-hero'} aria-labelledby="instructor-hero-title">
			<div className={'instructor-hero-grid'}>
				<div className={'instructor-hero-content'}>
					<span className={'instructor-hero-badge'}>{t('Meet Our Expert Instructors')}</span>
					<h1 id="instructor-hero-title" className={'instructor-hero-title'}>
						{t('Learn from the Best,')} <span className={'highlight'}>{t('Achieve Your Goals')}</span>
					</h1>
					<p className={'instructor-hero-subtitle'}>
						{t('Passionate educators from around the world, dedicated to your success.')}
					</p>
					<ul className={'instructor-hero-stats'}>
						{HERO_STATS.map((stat) => (
							<li key={stat.label}>
								<strong>{stat.value}</strong>
								<span>{t(stat.label)}</span>
							</li>
						))}
					</ul>
				</div>

				<div className={'instructor-collage'} aria-hidden="true">
					<div className={'collage-orb orb-1'} />
					<div className={'collage-orb orb-2'} />
					{COLLAGE_IMAGES.map((shot) => (
						<div key={shot.className} className={shot.className}>
							<img src={shot.src} alt="" loading="eager" />
						</div>
					))}
					<span className={'collage-badge'}>
						<WorkspacePremiumOutlinedIcon />
						{t('Top Instructors')}
					</span>
				</div>
			</div>
		</section>
	);
};

export default InstructorSearchHero;
