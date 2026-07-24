import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import ChatMessageItem from './ChatMessageItem';
import {
	CommunityReactionEmoji,
	CommunityRoomMessage,
	CommunityTypingUser,
} from '../../../types/community/room';

interface ChatMessageListProps {
	messages: CommunityRoomMessage[];
	selfId?: string;
	canModerate: boolean;
	typingUsers: CommunityTypingUser[];
	hasMore: boolean;
	loadingOlder: boolean;
	showNewMessages: boolean;
	onLoadOlder: () => void;
	onJumpToLatest: () => void;
	onNearBottomChange: (near: boolean) => void;
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

const ChatMessageList = ({
	messages,
	selfId,
	canModerate,
	typingUsers,
	hasMore,
	loadingOlder,
	showNewMessages,
	onLoadOlder,
	onJumpToLatest,
	onNearBottomChange,
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
}: ChatMessageListProps) => {
	const { t } = useTranslation('common');
	const scrollerRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const stickToBottomRef = useRef(true);
	const prevHeightRef = useRef(0);

	useEffect(() => {
		const node = scrollerRef.current;
		if (!node) return;
		const onScroll = () => {
			const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
			const near = distance < 80;
			stickToBottomRef.current = near;
			onNearBottomChange(near);
		};
		node.addEventListener('scroll', onScroll, { passive: true });
		return () => node.removeEventListener('scroll', onScroll);
	}, [onNearBottomChange]);

	useEffect(() => {
		const node = scrollerRef.current;
		if (!node) return;
		if (stickToBottomRef.current) {
			bottomRef.current?.scrollIntoView({ block: 'end' });
		}
	}, [messages.length, typingUsers.length]);

	const handleLoadOlder = () => {
		const node = scrollerRef.current;
		prevHeightRef.current = node?.scrollHeight ?? 0;
		onLoadOlder();
		requestAnimationFrame(() => {
			if (!node) return;
			const diff = node.scrollHeight - prevHeightRef.current;
			node.scrollTop += diff;
		});
	};

	return (
		<div className={'chat-message-list-wrap'}>
			{hasMore ? (
				<div className={'load-older-row'}>
					<button type="button" onClick={handleLoadOlder} disabled={loadingOlder}>
						{loadingOlder ? t('Loading…') : t('Load previous messages')}
					</button>
				</div>
			) : null}

			<div
				className={'chat-message-scroller'}
				ref={scrollerRef}
				role="log"
				aria-live="polite"
				aria-relevant="additions"
				aria-busy={loadingOlder}
			>
				{messages.map((message) => (
					<ChatMessageItem
						key={message.id}
						message={message}
						isOwn={message.author.id === selfId}
						canModerate={canModerate}
						onReply={onReply}
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
				))}
				{typingUsers.length > 0 ? (
					<p className={'typing-indicator'} aria-live="polite">
						{typingUsers.map((u) => u.name).join(', ')}{' '}
						{typingUsers.length === 1 ? t('is typing…') : t('are typing…')}
					</p>
				) : null}
				<div ref={bottomRef} />
			</div>

			{showNewMessages ? (
				<button type="button" className={'new-messages-btn'} onClick={onJumpToLatest}>
					{t('New messages')}
				</button>
			) : null}
		</div>
	);
};

export default ChatMessageList;
