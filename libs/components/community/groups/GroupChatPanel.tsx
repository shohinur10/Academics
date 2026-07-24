import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Drawer, IconButton, useMediaQuery } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ChatMessageList from '../room/ChatMessageList';
import ChatComposer from '../room/ChatComposer';
import ChatThreadPanel from '../room/ChatThreadPanel';
import { useCommunityRoom } from '../room/useCommunityRoom';
import { CommunityRoomMessage } from '../../../types/community/room';
import { sweetTopSuccessAlert } from '../../../sweetAlert';

interface GroupChatPanelProps {
	chatRoomSlug: string;
	canChat: boolean;
	fullScreen?: boolean;
	onCloseFullScreen?: () => void;
}

const GroupChatPanel = ({ chatRoomSlug, canChat, fullScreen, onCloseFullScreen }: GroupChatPanelProps) => {
	const { t } = useTranslation('common');
	const isPhone = useMediaQuery('(max-width:767px)');
	const {
		messages,
		typingUsers,
		selfMember,
		canModerate,
		hasMore,
		loadingOlder,
		sendMessage,
		retryMessage,
		editMessage,
		removeMessage,
		reactToMessage,
		loadPrevious,
		notifyTyping,
		threadParentId,
		setThreadParentId,
		threadParent,
		threadReplies,
	} = useCommunityRoom(chatRoomSlug);

	const [nearBottom, setNearBottom] = useState(true);
	const [unseenWhileReading, setUnseenWhileReading] = useState(false);
	const [editing, setEditing] = useState<CommunityRoomMessage | null>(null);
	const prevCountRef = useRef(0);

	useEffect(() => {
		if (messages.length > prevCountRef.current && !nearBottom) {
			setUnseenWhileReading(true);
		}
		prevCountRef.current = messages.length;
	}, [messages.length, nearBottom]);

	const placeholder = useCallback(
		async (message: string) => {
			await sweetTopSuccessAlert(t(message));
		},
		[t],
	);

	const handleSend = useCallback(
		async (text: string) => {
			if (!canChat) return { ok: false as const };
			if (editing) {
				editMessage(editing.id, text);
				setEditing(null);
				return { ok: true as const };
			}
			const result = await sendMessage(text);
			if (result.ok) {
				setNearBottom(true);
				setUnseenWhileReading(false);
			}
			return result;
		},
		[canChat, editing, editMessage, sendMessage],
	);

	const handleThreadSend = async (text: string) => {
		if (!threadParentId || !canChat) return { ok: false };
		return sendMessage(text, { parentId: threadParentId });
	};

	const listProps = {
		messages,
		selfId: selfMember?.id,
		canModerate: Boolean(canModerate),
		typingUsers,
		hasMore,
		loadingOlder,
		showNewMessages: unseenWhileReading && !nearBottom,
		onLoadOlder: loadPrevious,
		onJumpToLatest: () => {
			setUnseenWhileReading(false);
			setNearBottom(true);
			document
				.getElementById(`message-${messages[messages.length - 1]?.id}`)
				?.scrollIntoView({ behavior: 'smooth', block: 'end' });
		},
		onNearBottomChange: (near: boolean) => {
			setNearBottom(near);
			if (near) setUnseenWhileReading(false);
		},
		onReply: (id: string) => setThreadParentId(id),
		onReact: reactToMessage,
		onEdit: (message: CommunityRoomMessage) => setEditing(message),
		onDelete: removeMessage,
		onCopyLink: async (id: string) => {
			const url = `${window.location.href.split('#')[0]}#message-${id}`;
			try {
				await navigator.clipboard.writeText(url);
				await sweetTopSuccessAlert(t('Link copied'));
			} catch {
				await sweetTopSuccessAlert(t('Unable to copy link'));
			}
		},
		onReport: () => placeholder('Report message will be available soon.'),
		onRetry: retryMessage,
		onModeratorDelete: removeMessage,
		onTimeoutUser: () => placeholder('Timeout user will be available soon.'),
		onBlockUser: () => placeholder('Block user will be available soon.'),
	};

	const panel = (
		<div className={`group-chat-panel ${fullScreen ? 'is-fullscreen' : ''}`}>
			{fullScreen ? (
				<header className={'group-chat-fs-head'}>
					<h2>{t('Group chat')}</h2>
					<IconButton aria-label={t('Close')} onClick={onCloseFullScreen}>
						<CloseOutlinedIcon />
					</IconButton>
				</header>
			) : null}

			{!canChat ? (
				<p className={'group-chat-locked'} role="status">
					{t('Join this group to participate in chat.')}
				</p>
			) : null}

			{editing ? (
				<p className={'editing-banner'}>
					{t('Editing message')} ·{' '}
					<button type="button" onClick={() => setEditing(null)}>
						{t('Cancel')}
					</button>
				</p>
			) : null}

			<ChatMessageList {...listProps} />

			<ChatComposer
				disabled={!canChat || !selfMember}
				placeholder={
					!canChat
						? t('Join to chat')
						: editing
							? t('Edit your message…')
							: t('Message the group…')
				}
				onSend={handleSend}
				onTyping={notifyTyping}
				onEmoji={() => placeholder('Emoji picker will be available soon.')}
				onAttach={() => placeholder('Attachments will be available soon.')}
				onMention={() => placeholder('Mentions will be available soon.')}
			/>

			<ChatThreadPanel
				open={Boolean(threadParentId)}
				fullScreen={isPhone}
				parent={threadParent}
				replies={threadReplies}
				selfId={selfMember?.id}
				canModerate={Boolean(canModerate)}
				onClose={() => setThreadParentId(null)}
				onSend={handleThreadSend}
				onReact={reactToMessage}
				onEdit={(message) => setEditing(message)}
				onDelete={removeMessage}
				onCopyLink={listProps.onCopyLink}
				onReport={() => placeholder('Report message will be available soon.')}
				onRetry={retryMessage}
				onModeratorDelete={removeMessage}
				onTimeoutUser={() => placeholder('Timeout user will be available soon.')}
				onBlockUser={() => placeholder('Block user will be available soon.')}
			/>
		</div>
	);

	if (fullScreen) {
		return (
			<Drawer
				anchor="bottom"
				open
				onClose={onCloseFullScreen}
				className={'group-chat-drawer'}
				PaperProps={{ sx: { height: '100%', width: '100%' } }}
			>
				{panel}
			</Drawer>
		);
	}

	return panel;
};

export default GroupChatPanel;
