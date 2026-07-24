import React from 'react';
import { useTranslation } from 'next-i18next';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { CommunityRoomDetails, CommunityRoomRole } from '../../../types/community/room';

const ROLE_LABEL: Record<CommunityRoomRole, string> = {
	STUDENT: 'Student',
	INSTRUCTOR: 'Instructor',
	MODERATOR: 'Moderator',
	ADMIN: 'Admin',
};

interface ChatRoomRightPanelProps {
	room: CommunityRoomDetails;
	onReportRoom: () => void;
}

const ChatRoomRightPanel = ({ room, onReportRoom }: ChatRoomRightPanelProps) => {
	const { t } = useTranslation('common');
	const onlineMembers = room.members.filter((m) => m.online);

	return (
		<aside className={'chat-room-right'} aria-label={t('Room details')}>
			<section className={'right-panel-card'}>
				<h2>{t('Online members')}</h2>
				<ul className={'member-list'}>
					{onlineMembers.map((member) => (
						<li key={member.id}>
							<span className={'avatar-wrap'}>
								<img src={member.avatar} alt={`${member.name} avatar`} loading="lazy" />
								<span className={'online-dot'} aria-hidden="true" />
							</span>
							<div>
								<strong>{member.name}</strong>
								<em>{t(ROLE_LABEL[member.role])}</em>
							</div>
						</li>
					))}
				</ul>
			</section>

			<section className={'right-panel-card'}>
				<h2>{t('Room information')}</h2>
				<p className={'room-info-desc'}>{room.description}</p>
				<h3>{t('Room rules')}</h3>
				<ul className={'rules-list'}>
					{room.rules.map((rule) => (
						<li key={rule}>{rule}</li>
					))}
				</ul>
				<dl className={'room-meta-dl'}>
					<div>
						<dt>{t('Created')}</dt>
						<dd>{room.createdAt}</dd>
					</div>
					<div>
						<dt>{t('Creator')}</dt>
						<dd>{room.creatorName}</dd>
					</div>
				</dl>
				<h3>{t('Moderators')}</h3>
				<ul className={'mod-list'}>
					{room.moderators.map((mod) => (
						<li key={mod.id}>
							<img src={mod.avatar} alt="" loading="lazy" />
							<span>{mod.name}</span>
						</li>
					))}
				</ul>
				<button type="button" className={'report-room-btn'} onClick={onReportRoom}>
					<FlagOutlinedIcon />
					{t('Report room')}
				</button>
			</section>
		</aside>
	);
};

export default ChatRoomRightPanel;
