import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { CommunityStudyGroup, StudyGroupMembershipState } from '../../../types/community/group';

interface StudyGroupCardProps {
	group: CommunityStudyGroup;
	membership?: StudyGroupMembershipState;
	joining?: boolean;
	onJoin: (group: CommunityStudyGroup) => void;
}

const StudyGroupCard = ({ group, membership = 'none', joining, onJoin }: StudyGroupCardProps) => {
	const { t } = useTranslation('common');
	const joined = membership === 'joined' || membership === 'owner' || membership === 'moderator';
	const pending = membership === 'pending';

	return (
		<article className={'study-group-card study-group-card--rich'}>
			{group.coverImage ? (
				<img className={'group-cover-img'} src={group.coverImage} alt="" loading="lazy" />
			) : (
				<div className={`group-cover tone-${group.iconTone}`} aria-hidden="true" />
			)}
			<div className={'group-card-body'}>
				<div className={'group-card-top'}>
					<span className={`activity-pill activity-${group.activityLevel}`}>
						{t(group.activityLevel === 'high' ? 'High activity' : group.activityLevel === 'medium' ? 'Medium activity' : 'Low activity')}
					</span>
					<span className={'privacy-pill'}>
						{group.privacy === 'private' ? <LockOutlinedIcon fontSize="inherit" /> : <PublicOutlinedIcon fontSize="inherit" />}
						{t(group.privacy === 'private' ? 'Private' : 'Public')}
					</span>
				</div>
				<Link href={`/community/groups/${group.slug}`}>
					<h3>{t(group.name)}</h3>
				</Link>
				<p className={'group-desc'}>{group.description}</p>
				<p className={'group-meta-line'}>
					<span>{group.language}</span>
					<span aria-hidden="true">·</span>
					<span>{t(group.level)}</span>
					<span aria-hidden="true">·</span>
					<span>
						{group.memberCount.toLocaleString()} {t('members')}
					</span>
				</p>
				{group.tags.length > 0 ? (
					<ul className={'group-tags'}>
						{group.tags.slice(0, 3).map((tag) => (
							<li key={tag}>{tag}</li>
						))}
					</ul>
				) : null}
				<div className={'group-card-footer'}>
					<div className={'group-avatars'} aria-hidden="true">
						{group.avatars.slice(0, 3).map((src, index) => (
							<img key={`${group.slug}-${index}`} src={src} alt="" loading="lazy" />
						))}
					</div>
					{joined ? (
						<Link href={`/community/groups/${group.slug}`} className={'join-group-btn is-joined'}>
							{t('View Group')}
						</Link>
					) : pending ? (
						<button type="button" className={'join-group-btn is-pending'} disabled>
							{t('Pending approval')}
						</button>
					) : (
						<button
							type="button"
							className={'join-group-btn'}
							disabled={joining}
							onClick={() => onJoin(group)}
						>
							{joining ? t('Joining…') : t('Join Group')}
						</button>
					)}
				</div>
			</div>
		</article>
	);
};

export default StudyGroupCard;
