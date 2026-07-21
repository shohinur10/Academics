import React from 'react';
import { useTranslation } from 'next-i18next';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

export interface FeatureItem {
	icon: React.ReactNode;
	tone: string;
	title: string;
	desc: string;
}

const FEATURES: FeatureItem[] = [
	{
		icon: <SchoolOutlinedIcon />,
		tone: 'purple',
		title: 'Expert Instructors',
		desc: 'Learn from certified and experienced instructors.',
	},
	{
		icon: <ScheduleOutlinedIcon />,
		tone: 'pink',
		title: 'Flexible Learning',
		desc: 'Study anytime, anywhere at your own pace.',
	},
	{
		icon: <ForumOutlinedIcon />,
		tone: 'blue',
		title: 'Interactive Lessons',
		desc: 'Engaging lessons designed for real conversation.',
	},
	{
		icon: <TrackChangesOutlinedIcon />,
		tone: 'green',
		title: 'Progress Tracking',
		desc: 'Track your progress and achieve your learning goals.',
	},
	{
		icon: <GroupsOutlinedIcon />,
		tone: 'orange',
		title: 'Community Support',
		desc: 'Join a global community and practice together.',
	},
	{
		icon: <WorkspacePremiumOutlinedIcon />,
		tone: 'violet',
		title: 'Certificates',
		desc: 'Earn certificates and advance your language journey.',
	},
];

interface FeatureStripProps {
	items?: FeatureItem[];
}

const FeatureStrip = ({ items = FEATURES }: FeatureStripProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'feature-strip'} aria-label={t('Empower Your Future')}>
			{items.map((feature, index) => (
				<div key={feature.title} className={`feature-item ${index !== 0 ? 'with-separator' : ''}`}>
					<div className={`feature-icon tone-${feature.tone}`}>{feature.icon}</div>
					<strong>{t(feature.title)}</strong>
					<p>{t(feature.desc)}</p>
				</div>
			))}
		</section>
	);
};

export default FeatureStrip;
