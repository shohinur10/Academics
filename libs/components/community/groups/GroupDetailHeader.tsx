import React from 'react';
import { useTranslation } from 'next-i18next';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { StudyGroupDetails, StudyGroupMembershipState } from '../../../types/community/group';

interface GroupDetailHeaderProps {
	group: StudyGroupDetails;
	membership: StudyGroupMembershipState;
	busy?: boolean;
	onJoin: () => void;
	onLeave: () => void;
	onOpenMembers: () => void;
	onOpenChat?: () => void;
}

const membershipLabel = (state: StudyGroupMembershipState, t: (k: string) => string) => {
	switch (state) {
		case 'owner':
			return t('Owner');
		case 'moderator':
			return t('Moderator');
		case 'joined':
			return t('Member');
		case 'pending':
			return t('Pending approval');
		default:
			return '';
	}
};

const GroupDetailHeader = ({
	group,
	membership,
	busy,
	onJoin,
	onLeave,
	onOpenMembers,
	onOpenChat,
}: GroupDetailHeaderProps) => {
	const { t } = useTranslation('common');
	const member = membership === 'joined' || membership === 'owner' || membership === 'moderator';

	return (
		<header className={'group-detail-header'}>
			{group.coverImage ? (
				<img className={'group-detail-cover'} src={group.coverImage} alt="" />
			) : (
				<div className={`group-detail-cover tone-${group.iconTone}`} aria-hidden="true" />
			)}
			<div className={'group-detail-header-body'}>
				<div className={'group-detail-badges'}>
					<span className={'privacy-pill'}>
						{group.privacy === 'private' ? (
							<LockOutlinedIcon fontSize="inherit" />
						) : (
							<PublicOutlinedIcon fontSize="inherit" />
						)}
						{t(group.privacy === 'private' ? 'Private' : 'Public')}
					</span>
					<span className={`activity-pill activity-${group.activityLevel}`}>
						{t(group.activityLevel)} {t('activity')}
					</span>
					{membership !== 'none' ? <span className={'role-pill'}>{membershipLabel(membership, t)}</span> : null}
				</div>
				<h1>{t(group.name)}</h1>
				<p className={'group-detail-desc'}>{group.description}</p>
				<p className={'group-detail-stats'}>
					<button type="button" className={'text-btn'} onClick={onOpenMembers}>
						{group.memberCount.toLocaleString()} {t('members')}
					</button>
					<span aria-hidden="true">·</span>
					<span>
						{group.onlineCount} {t('online')}
					</span>
					<span aria-hidden="true">·</span>
					<span>
						{t('Created by')} {group.creator.name}
					</span>
				</p>
				{group.tags.length > 0 ? (
					<ul className={'group-tags'}>
						{group.tags.map((tag) => (
							<li key={tag}>{tag}</li>
						))}
					</ul>
				) : null}
				<div className={'group-detail-actions'}>
					{membership === 'pending' ? (
						<button type="button" className={'join-group-btn is-pending'} disabled>
							{t('Pending approval')}
						</button>
					) : member ? (
						<button type="button" className={'join-group-btn is-leave'} disabled={busy} onClick={onLeave}>
							{busy ? t('Working…') : t('Leave Group')}
						</button>
					) : (
						<button type="button" className={'join-group-btn'} disabled={busy} onClick={onJoin}>
							{busy ? t('Joining…') : t('Join Group')}
						</button>
					)}
					{onOpenChat ? (
						<button type="button" className={'secondary-action-btn'} onClick={onOpenChat}>
							{t('Open chat')}
						</button>
					) : null}
				</div>
			</div>
		</header>
	);
};

export default GroupDetailHeader;
