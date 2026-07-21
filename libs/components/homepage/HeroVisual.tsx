import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

/**
 * Final asset (add it here): transparent 3D WebP/PNG — purple globe with a black
 * graduation cap and gold tassel, standing on stacked books, small green plant,
 * floating purple spheres, soft purple shadows, transparent background.
 */
const FINAL_ASSET = '/images/home/hero-education-3d.webp';
/** Temporary placeholder shown automatically while the final asset is missing. */
const PLACEHOLDER_ASSET = '/images/home/hero-education-3d-placeholder.png';

interface FloatingCard {
	className: string;
	icon: React.ReactNode;
	title: string;
	value: string;
}

const FLOATING_CARDS: FloatingCard[] = [
	{ className: 'card-live', icon: <LiveTvOutlinedIcon />, title: 'Live Classes', value: '500+' },
	{ className: 'card-flexible', icon: <ScheduleOutlinedIcon />, title: 'Flexible Learning', value: 'Anytime, Anywhere' },
	{ className: 'card-experts', icon: <SchoolOutlinedIcon />, title: 'Expert Instructors', value: '15+' },
];

const HeroVisual = () => {
	const { t } = useTranslation('common');
	const [src, setSrc] = useState<string>(FINAL_ASSET);
	const isPlaceholder = src === PLACEHOLDER_ASSET;

	return (
		<div className={'hero-visual'}>
			<div className={'hero-visual-glow'} aria-hidden="true" />
			<Image
				src={src}
				alt="3D illustration of a purple globe wearing a black graduation cap with a gold tassel, standing on stacked books beside a small green plant"
				width={560}
				height={560}
				priority
				sizes="(max-width: 767px) 86vw, (max-width: 1280px) 440px, 560px"
				className={`hero-illustration ${isPlaceholder ? 'is-placeholder' : ''}`}
				onError={() => setSrc(PLACEHOLDER_ASSET)}
			/>
			{FLOATING_CARDS.map((card) => (
				<div key={card.className} className={`floating-card ${card.className}`}>
					<div className={'floating-card-icon'}>{card.icon}</div>
					<div className={'floating-card-text'}>
						<span>{t(card.title)}</span>
						<strong>{t(card.value)}</strong>
					</div>
				</div>
			))}
		</div>
	);
};

export default HeroVisual;
