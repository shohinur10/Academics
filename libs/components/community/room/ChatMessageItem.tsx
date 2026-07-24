import React, { memo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { Menu, MenuItem } from '@mui/material';
import {
	CommunityReactionEmoji,
	CommunityRoomMessage,
	CommunityRoomRole,
} from '../../../types/community/room';

const ROLE_LABEL: Record<CommunityRoomRole, string> = {
	STUDENT: 'Student',
	INSTRUCTOR: 'Instructor',
	MODERATOR: 'Moderator',
	ADMIN: 'Admin',
};

const QUICK_REACTIONS: CommunityReactionEmoji[] = ['👍', '❤️', '😂', '🎉', '🙏'];

interface ChatMessageItemProps {
	message: CommunityRoomMessage;
	isOwn: boolean;
	canModerate: boolean;
	onReply: (messageId: string) => void;
	onReact: (messageId: string, emoji: CommunityReactionEmoji) => void;
	onEdit: (message: CommunityRoomMessage) => void;
	onDelete: (messageId: string) => void;
	onCopyLink: (messageId: string) => void;
	onReport: (messageId: string) => void;
	onRetry: (message: CommunityRoomMessage) => void;
	onModeratorDelete: (messageId: string) => void;
	onTimeoutUser: (memberId: string) => void;
	onBlockUser: (memberId: string) => void;
}

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatMessageItem = memo(
	({
		message,
		isOwn,
		canModerate,
		onReply,
		onReact,
		onEdit,
		onDelete,
		onCopyLink,
		onReport,
		onRetry,
		onModeratorDelete,
		onTimeoutUser,
		onBlockUser,
	}: ChatMessageItemProps) => {
		const { t } = useTranslation('common');
		const [anchor, setAnchor] = useState<null | HTMLElement>(null);

		return (
			<article
				className={`chat-message-item status-${message.status}`}
				id={`message-${message.id}`}
				data-message-id={message.id}
			>
				<img src={message.author.avatar} alt={`${message.author.name} avatar`} loading="lazy" />
				<div className={'message-body'}>
					<div className={'message-head'}>
						<strong>{message.author.name}</strong>
						{message.author.verified ? (
							<VerifiedOutlinedIcon className={'verified'} aria-label={t('Verified instructor')} />
						) : null}
						<span className={`role-badge role-${message.author.role.toLowerCase()}`}>
							{t(ROLE_LABEL[message.author.role])}
						</span>
						<time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
						{message.edited ? <span className={'edited'}>{t('edited')}</span> : null}
						{message.status === 'pending' ? <span className={'pending'}>{t('Sending…')}</span> : null}
						{message.status === 'failed' ? (
							<button type="button" className={'retry-btn'} onClick={() => onRetry(message)}>
								{t('Failed · Retry')}
							</button>
						) : null}
					</div>

					<p className={'message-text'}>{message.text}</p>

					<div className={'message-footer'}>
						<div className={'reaction-row'}>
							{message.reactions.map((reaction) => (
								<button
									key={reaction.emoji}
									type="button"
									className={reaction.reactedByMe ? 'on' : ''}
									aria-pressed={reaction.reactedByMe}
									onClick={() => onReact(message.id, reaction.emoji)}
								>
									{reaction.emoji} {reaction.count}
								</button>
							))}
							<div className={'quick-react'}>
								{QUICK_REACTIONS.map((emoji) => (
									<button
										key={emoji}
										type="button"
										aria-label={`${t('React with')} ${emoji}`}
										onClick={() => onReact(message.id, emoji)}
									>
										{emoji}
									</button>
								))}
							</div>
						</div>

						<button type="button" className={'text-action'} onClick={() => onReply(message.id)}>
							<ReplyOutlinedIcon />
							{message.replyCount > 0 ? `${message.replyCount} ${t('replies')}` : t('Reply')}
						</button>

						<button
							type="button"
							className={'icon-more'}
							aria-label={t('Message actions')}
							aria-haspopup="menu"
							onClick={(e) => setAnchor(e.currentTarget)}
						>
							<MoreHorizIcon />
						</button>
					</div>
				</div>

				<Menu
					anchorEl={anchor}
					open={Boolean(anchor)}
					onClose={() => setAnchor(null)}
					className={'chat-message-actions-menu'}
					MenuListProps={{ 'aria-label': t('Message actions') }}
				>
					<MenuItem
						onClick={() => {
							setAnchor(null);
							onReply(message.id);
						}}
					>
						{t('Reply')}
					</MenuItem>
					{isOwn ? (
						<MenuItem
							onClick={() => {
								setAnchor(null);
								onEdit(message);
							}}
						>
							{t('Edit')}
						</MenuItem>
					) : null}
					{isOwn ? (
						<MenuItem
							onClick={() => {
								setAnchor(null);
								onDelete(message.id);
							}}
						>
							{t('Delete')}
						</MenuItem>
					) : null}
					<MenuItem
						onClick={() => {
							setAnchor(null);
							onCopyLink(message.id);
						}}
					>
						{t('Copy link')}
					</MenuItem>
					{!isOwn ? (
						<MenuItem
							onClick={() => {
								setAnchor(null);
								onReport(message.id);
							}}
						>
							{t('Report message')}
						</MenuItem>
					) : null}
					{canModerate && !isOwn ? (
						<MenuItem
							onClick={() => {
								setAnchor(null);
								onModeratorDelete(message.id);
							}}
						>
							{t('Moderator delete')}
						</MenuItem>
					) : null}
					{canModerate && !isOwn ? (
						<MenuItem
							onClick={() => {
								setAnchor(null);
								onTimeoutUser(message.author.id);
							}}
						>
							{t('Timeout user')}
						</MenuItem>
					) : null}
					{canModerate && !isOwn ? (
						<MenuItem
							onClick={() => {
								setAnchor(null);
								onBlockUser(message.author.id);
							}}
						>
							{t('Block user')}
						</MenuItem>
					) : null}
				</Menu>
			</article>
		);
	},
);

ChatMessageItem.displayName = 'ChatMessageItem';

export default ChatMessageItem;
