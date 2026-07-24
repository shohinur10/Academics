import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SpellcheckOutlinedIcon from '@mui/icons-material/SpellcheckOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { CommunityNavId, CommunityRoom, CommunityStudyGroup } from '../../../types/community/community';

const NAV_ITEMS: { id: CommunityNavId; label: string; icon: React.ReactNode }[] = [
	{ id: 'home', label: 'Community Home', icon: <HomeOutlinedIcon /> },
	{ id: 'feed', label: 'My Feed', icon: <DynamicFeedOutlinedIcon /> },
	{ id: 'mentions', label: 'Mentions', icon: <AlternateEmailOutlinedIcon /> },
	{ id: 'bookmarks', label: 'Bookmarks', icon: <BookmarkBorderOutlinedIcon /> },
];

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

interface CommunitySidebarProps {
	activeNav: CommunityNavId;
	onNavSelect: (id: CommunityNavId) => void;
	rooms: CommunityRoom[];
	groups: CommunityStudyGroup[];
	activeRoomSlug?: string;
	onCreateGroup: () => void;
}

const CommunitySidebar = ({
	activeNav,
	onNavSelect,
	rooms,
	groups,
	activeRoomSlug,
	onCreateGroup,
}: CommunitySidebarProps) => {
	const { t } = useTranslation('common');
	const previewGroups = groups.slice(0, 4);

	return (
		<aside className={'community-sidebar'} aria-label={t('Community navigation')}>
			<nav className={'community-side-nav'} aria-label={t('Community sections')}>
				{NAV_ITEMS.map((item) => (
					<button
						key={item.id}
						type="button"
						className={`side-nav-item ${activeNav === item.id ? 'active' : ''}`}
						aria-current={activeNav === item.id ? 'page' : undefined}
						onClick={() => onNavSelect(item.id)}
					>
						{item.icon}
						<span>{t(item.label)}</span>
					</button>
				))}
			</nav>

			<section className={'community-side-section'} aria-labelledby="topic-rooms-heading">
				<div className={'section-head'}>
					<h2 id="topic-rooms-heading">{t('Topic Rooms')}</h2>
					<Link href="/community/rooms" className={'section-link'}>
						{t('View All Rooms')}
					</Link>
				</div>
				<ul className={'room-list'}>
					{rooms.map((room) => (
						<li key={room.slug}>
							<Link
								href={`/community/rooms/${room.slug}`}
								className={`room-item ${activeRoomSlug === room.slug ? 'active' : ''}`}
							>
								<span className={'room-icon'} aria-hidden="true">
									{ROOM_ICONS[room.icon]}
								</span>
								<span className={'room-meta'}>
									<span className={'room-name'}>{t(room.name)}</span>
									{typeof room.onlineCount === 'number' && (
										<span className={'room-online'}>
											{room.onlineCount} {t('online')}
										</span>
									)}
								</span>
								{room.unreadCount ? (
									<span className={'room-unread'} aria-label={`${room.unreadCount} ${t('unread')}`}>
										{room.unreadCount}
									</span>
								) : null}
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section className={'community-side-section'} aria-labelledby="study-groups-preview-heading">
				<div className={'section-head'}>
					<h2 id="study-groups-preview-heading">{t('Study Groups')}</h2>
					<Link href="/community/groups" className={'section-link'}>
						{t('View All Groups')}
					</Link>
				</div>
				<ul className={'group-preview-list'}>
					{previewGroups.map((group) => (
						<li key={group.slug}>
							<Link href={`/community/groups/${group.slug}`} className={'group-preview-item'}>
								<span className={`group-dot tone-${group.iconTone}`} aria-hidden="true" />
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
				<button type="button" className={'create-group-btn'} onClick={onCreateGroup}>
					<AddRoundedIcon />
					{t('Create Group')}
				</button>
			</section>
		</aside>
	);
};

export default CommunitySidebar;
