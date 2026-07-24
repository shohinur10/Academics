import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import { CommunityCreateAction, CommunityStats } from '../../../types/community/community';

interface CommunityHeroProps {
	userName: string;
	stats: CommunityStats;
	onCreate: (action: CommunityCreateAction, draft?: string) => void;
}

const CREATE_ACTIONS: { id: CommunityCreateAction; label: string; icon: React.ReactNode }[] = [
	{ id: 'post', label: 'Post', icon: <EditNoteOutlinedIcon /> },
	{ id: 'question', label: 'Ask Question', icon: <HelpOutlineOutlinedIcon /> },
	{ id: 'poll', label: 'Create Poll', icon: <PollOutlinedIcon /> },
	{ id: 'resource', label: 'Share Resource', icon: <AttachFileOutlinedIcon /> },
];

const CommunityHero = ({ userName, stats, onCreate }: CommunityHeroProps) => {
	const { t } = useTranslation('common');
	const [draft, setDraft] = useState('');

	const submitComposer = (event: FormEvent) => {
		event.preventDefault();
		onCreate('post', draft.trim());
	};

	const metricItems = [
		{ icon: <GroupsOutlinedIcon />, value: stats.members, label: 'Members' },
		{ icon: <ForumOutlinedIcon />, value: stats.discussions, label: 'Discussions' },
		{ icon: <QuestionAnswerOutlinedIcon />, value: stats.answers, label: 'Answers' },
		{ icon: <Diversity3OutlinedIcon />, value: stats.studyGroups, label: 'Study Groups' },
	];

	return (
		<section className={'community-hero'} aria-labelledby="community-hero-title" id="create">
			<p className={'hero-welcome'}>
				{t('Welcome back')}, <strong>{userName}</strong>
			</p>
			<h1 id="community-hero-title" className={'hero-title'}>
				{t('Learn together.')} <span>{t('Grow together.')}</span>
			</h1>
			<p className={'hero-subtitle'}>
				{t('Share ideas, ask questions, and connect with learners around the world.')}
			</p>

			<ul className={'community-metrics'} aria-label={t('Community metrics')}>
				{metricItems.map((item) => (
					<li key={item.label}>
						<span className={'metric-icon'} aria-hidden="true">
							{item.icon}
						</span>
						<div>
							<strong>{item.value.toLocaleString()}</strong>
							<span>{t(item.label)}</span>
						</div>
					</li>
				))}
			</ul>

			<form className={'community-composer'} onSubmit={submitComposer}>
				<label htmlFor="community-composer-input" className={'visually-hidden'}>
					{t("What's on your mind?")}
				</label>
				<input
					id="community-composer-input"
					type="text"
					value={draft}
					placeholder={t("What's on your mind?")}
					onChange={(e) => setDraft(e.target.value)}
				/>
				<div className={'composer-actions'} role="group" aria-label={t('Create content')}>
					{CREATE_ACTIONS.map((action) => (
						<button
							key={action.id}
							type={action.id === 'post' ? 'submit' : 'button'}
							className={'composer-action'}
							onClick={
								action.id === 'post'
									? undefined
									: () => onCreate(action.id, draft.trim() || undefined)
							}
						>
							{action.icon}
							{t(action.label)}
						</button>
					))}
				</div>
			</form>
		</section>
	);
};

export default CommunityHero;
