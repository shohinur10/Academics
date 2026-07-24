import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SpellcheckOutlinedIcon from '@mui/icons-material/SpellcheckOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { CommunityRoom } from '../../../types/community/community';
import { CommunityStudyGroup } from '../../../types/community/community';

const ROOM_ICONS: Record<CommunityRoom['icon'], React.ReactNode> = {
	chat: <ForumOutlinedIcon />,
	english: <TranslateOutlinedIcon />,
	korean: <TranslateOutlinedIcon />,
	ielts: <MenuBookOutlinedIcon />,
	topik: <SchoolOutlinedIcon />,
	grammar: <SpellcheckOutlinedIcon />,
	partners: <Diversity3OutlinedIcon />,
	business: <WorkOutlineOutlinedIcon />,
};

interface ChatRoomSidebarProps {
	rooms: CommunityRoom[];
	groups: CommunityStudyGroup[];
	activeSlug: string;
	canCreateRoom: boolean;
	onCreateRoom: () => void;
}

const ChatRoomSidebar = ({ rooms, groups, activeSlug, canCreateRoom, onCreateRoom }: ChatRoomSidebarProps) => {
	const { t } = useTranslation('common');

	return (
		<aside className={'chat-room-sidebar'} aria-label={t('Rooms')}>
			<div className={'sidebar-block'}>
				<div className={'sidebar-head'}>
					<h2>{t('Topic Rooms')}</h2>
					<Link href="/community/rooms">{t('View All Rooms')}</Link>
				</div>
				<ul className={'room-nav-list'}>
					{rooms.map((room) => (
						<li key={room.slug}>
							<Link
								href={`/community/rooms/${room.slug}`}
								className={`room-nav-item ${activeSlug === room.slug ? 'active' : ''}`}
								aria-current={activeSlug === room.slug ? 'page' : undefined}
							>
								<span className={'room-nav-icon'} aria-hidden="true">
									{ROOM_ICONS[room.icon]}
								</span>
								<span className={'room-nav-meta'}>
									<strong>{t(room.name)}</strong>
									{typeof room.onlineCount === 'number' && (
										<em>
											{room.onlineCount} {t('online')}
										</em>
									)}
								</span>
								{room.unreadCount ? <span className={'room-nav-unread'}>{room.unreadCount}</span> : null}
							</Link>
						</li>
					))}
				</ul>
				{canCreateRoom ? (
					<button type="button" className={'create-room-btn'} onClick={onCreateRoom}>
						<AddRoundedIcon />
						{t('Create Room')}
					</button>
				) : null}
			</div>

			<div className={'sidebar-block'}>
				<div className={'sidebar-head'}>
					<h2>{t('Study Groups')}</h2>
					<Link href="/community/groups">{t('View All Groups')}</Link>
				</div>
				<ul className={'group-nav-list'}>
					{groups.slice(0, 4).map((group) => (
						<li key={group.slug}>
							<Link href={`/community/groups/${group.slug}`}>
								<span className={`tone-dot tone-${group.iconTone}`} aria-hidden="true" />
								<span>
									<strong>{t(group.name)}</strong>
									<em>
										{group.memberCount.toLocaleString()} {t('members')}
									</em>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
};

export default ChatRoomSidebar;
