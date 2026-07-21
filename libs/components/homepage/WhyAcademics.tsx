import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

const features = [
	{
		icon: <SchoolOutlinedIcon sx={{ fontSize: 40 }} />,
		title: 'Expert Teachers',
		desc: 'Learn from certified instructors with years of real-world teaching experience.',
	},
	{
		icon: <ScheduleOutlinedIcon sx={{ fontSize: 40 }} />,
		title: 'Flexible Schedule',
		desc: 'Choose online, offline, or hybrid classes that fit your lifestyle.',
	},
	{
		icon: <VideocamOutlinedIcon sx={{ fontSize: 40 }} />,
		title: 'Live & Recorded',
		desc: 'Attend live sessions and replay recordings anytime you need a refresher.',
	},
	{
		icon: <WorkspacePremiumOutlinedIcon sx={{ fontSize: 40 }} />,
		title: 'Certificate',
		desc: 'Earn a recognized certificate upon completing your course successfully.',
	},
];

const WhyAcademics = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<div className={'why-academics'} style={{ padding: '16px 32px' }}>
				<Typography variant="h5">Why Academics?</Typography>
				{features.map((f) => (
					<div key={f.title} style={{ marginTop: 16 }}>
						{f.icon}
						<Typography fontWeight={600}>{f.title}</Typography>
						<Typography variant="body2">{f.desc}</Typography>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={'why-academics'}>
			<Stack className={'container'}>
				<div className={'info-box'} style={{ marginBottom: 32 }}>
					<div className={'left'}>
						<span>Why Academics?</span>
						<p>Everything you need to succeed in language learning</p>
					</div>
				</div>
				<div className={'features-grid'} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
					{features.map((feature) => (
						<div key={feature.title} className={'feature-box'}>
							<div className={'feature-icon'}>{feature.icon}</div>
							<Typography className={'feature-title'}>{feature.title}</Typography>
							<Typography className={'feature-desc'}>{feature.desc}</Typography>
						</div>
					))}
				</div>
			</Stack>
		</div>
	);
};

export default WhyAcademics;
