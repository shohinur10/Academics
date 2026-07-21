import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HeroVisual from './HeroVisual';

interface HeroStat {
	value: string;
	label: string;
}

const STATS: HeroStat[] = [
	{ value: '500+', label: 'Students' },
	{ value: '20+', label: 'Courses' },
	{ value: '15+', label: 'Instructors' },
	{ value: '98%', label: 'Satisfaction' },
];

const HeroSection = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const heroContent = (
		<div className={'hero-content'}>
			<span className={'hero-badge'}>✨ {t('Empower Your Future')}</span>
			<h1 className={'hero-title'}>
				{t('Hero Heading')} <span className={'highlight'}>{t('Hero Heading Highlight')}</span>
			</h1>
			<p className={'hero-subtitle'}>{t('Hero Subtitle')}</p>
			<div className={'hero-actions'}>
				<Link href={'/course'}>
					<button type="button" className={'hero-btn-primary'}>
						{t('Browse Courses')}
						<EastOutlinedIcon />
					</button>
				</Link>
				<Link href={'/cs'}>
					<button type="button" className={'hero-btn-secondary'}>
						<PlayCircleOutlinedIcon />
						{t('Free Trial')}
					</button>
				</Link>
			</div>
			<div className={'hero-stats'}>
				{STATS.map((stat, index) => (
					<React.Fragment key={stat.label}>
						{index === 0 && (
							<div className={'hero-stats-icon'} aria-hidden="true">
								<PeopleAltOutlinedIcon />
							</div>
						)}
						<div className={'hero-stat'}>
							<strong>{stat.value}</strong>
							<span>{t(stat.label)}</span>
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);

	if (device === 'mobile') {
		return (
			<section className={'home-hero'}>
				<div className={'hero-decor'} aria-hidden="true">
					<span className={'blob blob-1'} />
					<span className={'blob blob-2'} />
				</div>
				<div className={'hero-grid'}>
					{heroContent}
					<HeroVisual />
				</div>
			</section>
		);
	}

	return (
		<section className={'home-hero'}>
			<div className={'hero-decor'} aria-hidden="true">
				<span className={'blob blob-1'} />
				<span className={'blob blob-2'} />
				<span className={'blob blob-3'} />
				<span className={'sphere sphere-1'} />
				<span className={'sphere sphere-2'} />
			</div>
			<div className={'hero-grid'}>
				{heroContent}
				<HeroVisual />
			</div>
		</section>
	);
};

export default HeroSection;
