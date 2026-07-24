import React from 'react';
import { useTranslation } from 'next-i18next';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SpellcheckOutlinedIcon from '@mui/icons-material/SpellcheckOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { CommunityRoomDetails } from '../../../types/community/room';

const ICONS = {
	chat: <ForumOutlinedIcon />,
	english: <TranslateOutlinedIcon />,
	korean: <TranslateOutlinedIcon />,
	ielts: <MenuBookOutlinedIcon />,
	topik: <SchoolOutlinedIcon />,
	grammar: <SpellcheckOutlinedIcon />,
	partners: <Diversity3OutlinedIcon />,
	business: <WorkOutlineOutlinedIcon />,
};

interface ChatRoomHeaderProps {
	room: CommunityRoomDetails;
	muted: boolean;
	canManage: boolean;
	onToggleMute: () => void;
	onSearch: () => void;
	onSettings: () => void;
	onOpenRooms: () => void;
	onOpenMembers: () => void;
}

const ChatRoomHeader = ({
	room,
	muted,
	canManage,
	onToggleMute,
	onSearch,
	onSettings,
	onOpenRooms,
	onOpenMembers,
}: ChatRoomHeaderProps) => {
	const { t } = useTranslation('common');

	return (
		<header className={'chat-room-header'}>
			<button type="button" className={'mobile-only icon-btn'} aria-label={t('Open rooms menu')} onClick={onOpenRooms}>
				<MenuOutlinedIcon />
			</button>

			<div className={'room-title-block'}>
				<span className={'room-title-icon'} aria-hidden="true">
					{ICONS[room.icon]}
				</span>
				<div>
					<h1>{t(room.name)}</h1>
					<p>
						<strong>{room.onlineCount}</strong> {t('online')} · {room.description}
					</p>
				</div>
			</div>

			<div className={'room-header-actions'}>
				<button
					type="button"
					className={'icon-btn'}
					aria-label={muted ? t('Unmute notifications') : t('Mute notifications')}
					aria-pressed={muted}
					onClick={onToggleMute}
				>
					{muted ? <NotificationsOffOutlinedIcon /> : <NotificationsNoneOutlinedIcon />}
				</button>
				<button type="button" className={'icon-btn'} aria-label={t('Search messages')} onClick={onSearch}>
					<SearchOutlinedIcon />
				</button>
				{canManage ? (
					<button type="button" className={'icon-btn'} aria-label={t('Room settings')} onClick={onSettings}>
						<SettingsOutlinedIcon />
					</button>
				) : null}
				<button
					type="button"
					className={'mobile-only icon-btn'}
					aria-label={t('Online members')}
					onClick={onOpenMembers}
				>
					<PeopleAltOutlinedIcon />
				</button>
			</div>
		</header>
	);
};

export default ChatRoomHeader;
