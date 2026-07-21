import React from 'react';
import { Button, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const HeroSection = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const stats = [
		{ value: '500+', label: t('Students') },
		{ value: '20+', label: t('Courses') },
		{ value: '15+', label: t('Instructors') },
		{ value: '98%', label: t('Satisfaction') },
	];

	if (device === 'mobile') {
		return (
			<div className={'hero-section'} style={{ padding: '24px 16px' }}>
				<Typography variant="h4" className={'hero-title'}>
					{t('Hero Title')}
				</Typography>
				<Typography className={'hero-subtitle'}>{t('Hero Subtitle')}</Typography>
				<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
					<Link href="/course">
						<Button variant="contained" size="small">
							{t('Browse Courses')}
						</Button>
					</Link>
					<Link href="/cs">
						<Button variant="outlined" size="small" sx={{ color: '#fff', borderColor: '#fff' }}>
							{t('Free Trial')}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className={'hero-section'}>
			<Typography variant="h2" className={'hero-title'}>
				{t('Hero Title')}
			</Typography>
			<Typography className={'hero-subtitle'}>{t('Hero Subtitle')}</Typography>
			<div className={'hero-actions'} style={{ display: 'flex', gap: 16 }}>
				<Link href="/course">
					<Button variant="contained" size="large" className={'hero-btn-primary'}>
						{t('Browse Courses')}
					</Button>
				</Link>
				<Link href="/cs">
					<Button variant="outlined" size="large" className={'hero-btn-secondary'}>
						{t('Free Trial')}
					</Button>
				</Link>
			</div>
			<div className={'hero-stats'} style={{ display: 'flex', gap: 32, marginTop: 40 }}>
				{stats.map((stat) => (
					<div key={stat.label} className={'hero-stat'}>
						<Typography className={'hero-stat-value'}>{stat.value}</Typography>
						<Typography className={'hero-stat-label'}>{stat.label}</Typography>
					</div>
				))}
			</div>
		</div>
	);
};

export default HeroSection;
