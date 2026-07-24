import React from 'react';
import { useTranslation } from 'next-i18next';
import { Drawer, IconButton } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ChatMessageItem from './ChatMessageItem';
import ChatComposer from './ChatComposer';
import {
	CommunityReactionEmoji,
	CommunityRoomMessage,
} from '../../../types/community/room';

interface ChatThreadPanelProps {
	open: boolean;
	fullScreen: boolean;
	parent: CommunityRoomMessage | null;
	replies: CommunityRoomMessage[];
	selfId?: string;
	canModerate: boolean;
	onClose: () => void;
	onSend: (text: string) => Promise<{ ok: boolean } | void> | { ok: boolean } | void;
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

const ChatThreadPanel = ({
	open,
	fullScreen,
	parent,
	replies,
	selfId,
	canModerate,
	onClose,
	onSend,
	onReact,
	onEdit,
	onDelete,
	onCopyLink,
	onReport,
	onRetry,
	onModeratorDelete,
	onTimeoutUser,
	onBlockUser,
}: ChatThreadPanelProps) => {
	const { t } = useTranslation('common');

	return (
		<Drawer
			anchor={fullScreen ? 'bottom' : 'right'}
			open={open}
			onClose={onClose}
			className={`chat-thread-drawer ${fullScreen ? 'full' : ''}`}
			PaperProps={
				fullScreen
					? { sx: { height: '100%', maxHeight: '100dvh', width: '100%', borderRadius: 0 } }
					: undefined
			}
		>
			<div className={'thread-panel'}>
				<div className={'thread-head'}>
					<strong>{t('Thread')}</strong>
					<IconButton aria-label={t('Close thread')} onClick={onClose}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				{parent ? (
					<>
						<div className={'thread-parent'}>
							<ChatMessageItem
								message={parent}
								isOwn={parent.author.id === selfId}
								canModerate={canModerate}
								onReply={() => undefined}
								onReact={onReact}
								onEdit={onEdit}
								onDelete={onDelete}
								onCopyLink={onCopyLink}
								onReport={onReport}
								onRetry={onRetry}
								onModeratorDelete={onModeratorDelete}
								onTimeoutUser={onTimeoutUser}
								onBlockUser={onBlockUser}
							/>
						</div>
						<div className={'thread-replies'}>
							{replies.length === 0 ? (
								<p className={'thread-empty'}>{t('No replies yet. Start the thread.')}</p>
							) : (
								replies.map((message) => (
									<ChatMessageItem
										key={message.id}
										message={message}
										isOwn={message.author.id === selfId}
										canModerate={canModerate}
										onReply={() => undefined}
										onReact={onReact}
										onEdit={onEdit}
										onDelete={onDelete}
										onCopyLink={onCopyLink}
										onReport={onReport}
										onRetry={onRetry}
										onModeratorDelete={onModeratorDelete}
										onTimeoutUser={onTimeoutUser}
										onBlockUser={onBlockUser}
									/>
								))
							)}
						</div>
						<ChatComposer
							onSend={onSend}
							onTyping={() => undefined}
							onEmoji={() => undefined}
							onAttach={() => undefined}
							onMention={() => undefined}
							placeholder={t('Reply in thread…')}
						/>
					</>
				) : null}
			</div>
		</Drawer>
	);
};

export default ChatThreadPanel;
