import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import { HelpTopic, HelpTopicId } from '../../../types/support/helpCenter';

const TOPIC_ICONS: Record<HelpTopicId, React.ReactNode> = {
	account: <PersonOutlineOutlinedIcon />,
	courses: <MenuBookOutlinedIcon />,
	payments: <PaymentsOutlinedIcon />,
	live: <VideocamOutlinedIcon />,
	certificates: <WorkspacePremiumOutlinedIcon />,
	technical: <BuildOutlinedIcon />,
	instructors: <SchoolOutlinedIcon />,
	community: <Diversity3OutlinedIcon />,
};

interface HelpTopicsProps {
	topics: HelpTopic[];
}

const HelpTopics = ({ topics }: HelpTopicsProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'help-section help-topics'} aria-labelledby="help-topics-title">
			<div className={'section-heading'}>
				<h2 id="help-topics-title">{t('Browse by topic')}</h2>
				<p>{t('Find answers organized by the areas learners and instructors use most.')}</p>
			</div>
			<ul className={'topic-grid'}>
				{topics.map((topic) => (
					<li key={topic.id}>
						<Link href={topic.href} className={'topic-card'}>
							<span className={'topic-icon'} aria-hidden="true">
								{TOPIC_ICONS[topic.id]}
							</span>
							<h3>{t(topic.title)}</h3>
							<p>{t(topic.description)}</p>
							<span className={'topic-count'}>
								{topic.articleCount} {t('articles')}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
};

export default HelpTopics;
