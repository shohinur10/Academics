import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Drawer, IconButton, useMediaQuery } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import ChatRoomSidebar from '../../../libs/components/community/room/ChatRoomSidebar';
import ChatRoomHeader from '../../../libs/components/community/room/ChatRoomHeader';
import ChatMessageList from '../../../libs/components/community/room/ChatMessageList';
import ChatComposer from '../../../libs/components/community/room/ChatComposer';
import ChatRoomRightPanel from '../../../libs/components/community/room/ChatRoomRightPanel';
import ChatThreadPanel from '../../../libs/components/community/room/ChatThreadPanel';
import { useCommunityRoom } from '../../../libs/components/community/room/useCommunityRoom';
import { COMMUNITY_ROOMS, COMMUNITY_STUDY_GROUPS } from '../../../libs/mock/community.mock';
import { COMMUNITY_ROOM_SLUGS } from '../../../libs/mock/communityRooms.mock';
import { CommunityRoomMessage } from '../../../libs/types/community/room';
import { sweetTopSuccessAlert } from '../../../libs/sweetAlert';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const paths = (locales ?? ['en']).flatMap((locale) =>
		COMMUNITY_ROOM_SLUGS.map((slug) => ({ params: { slug }, locale })),
	);
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const CommunityChatRoomPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined;
	const isPhone = useMediaQuery('(max-width:767px)');

	const {
		room,
		messages,
		typingUsers,
		selfMember,
		canModerate,
		canCreateRoom,
		muted,
		setMuted,
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
	} = useCommunityRoom(slug);

	const [roomsOpen, setRoomsOpen] = useState(false);
	const [membersOpen, setMembersOpen] = useState(false);
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

	const placeholderAction = useCallback(
		async (message: string) => {
			await sweetTopSuccessAlert(t(message));
		},
		[t],
	);

	const handleSend = async (text: string) => {
		if (editing) {
			editMessage(editing.id, text);
			setEditing(null);
			return { ok: true };
		}
		const result = await sendMessage(text);
		if (result.ok) {
			setNearBottom(true);
			setUnseenWhileReading(false);
		}
		return result;
	};

	const handleThreadSend = async (text: string) => {
		if (!threadParentId) return { ok: false };
		return sendMessage(text, { parentId: threadParentId });
	};

	if (!slug || !room) {
		return (
			<div className={'community-stub-page'}>
				<div className={'community-stub-card'}>
					<h1>{t('Room not found')}</h1>
					<p>{t('This topic room does not exist or is no longer available.')}</p>
					<Link href="/community" className={'stub-btn'}>
						{t('Back to Community')}
					</Link>
				</div>
			</div>
		);
	}

	const sidebar = (
		<ChatRoomSidebar
			rooms={COMMUNITY_ROOMS}
			groups={COMMUNITY_STUDY_GROUPS}
			activeSlug={room.slug}
			canCreateRoom={Boolean(canCreateRoom)}
			onCreateRoom={() => placeholderAction('Create Room will be available soon.')}
		/>
	);

	const rightPanel = (
		<ChatRoomRightPanel room={room} onReportRoom={() => placeholderAction('Report room will be available soon.')} />
	);

	return (
		<div className={'community-chat-room-page'}>
			<div className={'chat-room-shell'}>
				<div className={'chat-left-col'}>{sidebar}</div>

				<section className={'chat-center-col'} aria-label={t(room.name)}>
					<ChatRoomHeader
						room={room}
						muted={muted}
						canManage={Boolean(canModerate || canCreateRoom)}
						onToggleMute={() => setMuted((prev) => !prev)}
						onSearch={() => placeholderAction('Message search will be available soon.')}
						onSettings={() => placeholderAction('Room settings will be available soon.')}
						onOpenRooms={() => setRoomsOpen(true)}
						onOpenMembers={() => setMembersOpen(true)}
					/>

					<ChatMessageList
						messages={messages}
						selfId={selfMember?.id}
						canModerate={Boolean(canModerate)}
						typingUsers={typingUsers}
						hasMore={hasMore}
						loadingOlder={loadingOlder}
						showNewMessages={unseenWhileReading && !nearBottom}
						onLoadOlder={loadPrevious}
						onJumpToLatest={() => {
							setUnseenWhileReading(false);
							setNearBottom(true);
							document
								.getElementById(`message-${messages[messages.length - 1]?.id}`)
								?.scrollIntoView({ behavior: 'smooth', block: 'end' });
						}}
						onNearBottomChange={(near) => {
							setNearBottom(near);
							if (near) setUnseenWhileReading(false);
						}}
						onReply={(id) => setThreadParentId(id)}
						onReact={reactToMessage}
						onEdit={(message) => setEditing(message)}
						onDelete={removeMessage}
						onCopyLink={async (id) => {
							const url = `${window.location.origin}/community/rooms/${room.slug}#message-${id}`;
							try {
								await navigator.clipboard.writeText(url);
								await sweetTopSuccessAlert(t('Link copied'));
							} catch {
								await sweetTopSuccessAlert(t('Unable to copy link'));
							}
						}}
						onReport={() => placeholderAction('Report message will be available soon.')}
						onRetry={retryMessage}
						onModeratorDelete={(id) => {
							removeMessage(id);
						}}
						onTimeoutUser={() => placeholderAction('Timeout user will be available soon.')}
						onBlockUser={() => placeholderAction('Block user will be available soon.')}
					/>

					{editing ? (
						<p className={'editing-banner'}>
							{t('Editing message')} ·{' '}
							<button type="button" onClick={() => setEditing(null)}>
								{t('Cancel')}
							</button>
						</p>
					) : null}

					<ChatComposer
						disabled={!selfMember}
						placeholder={
							selfMember
								? editing
									? t('Edit your message…')
									: t('Write a message…')
								: t('Log in to join the conversation')
						}
						onSend={handleSend}
						onTyping={notifyTyping}
						onEmoji={() => placeholderAction('Emoji picker will be available soon.')}
						onAttach={() => placeholderAction('Attachments will be available soon.')}
						onMention={() => placeholderAction('Mentions will be available soon.')}
					/>
				</section>

				<div className={'chat-right-col'}>{rightPanel}</div>
			</div>

			<Drawer anchor="left" open={roomsOpen} onClose={() => setRoomsOpen(false)} className={'chat-rooms-drawer'}>
				<div className={'drawer-head'}>
					<span>{t('Rooms')}</span>
					<IconButton aria-label={t('Close rooms menu')} onClick={() => setRoomsOpen(false)}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				{sidebar}
			</Drawer>

			<Drawer
				anchor="right"
				open={membersOpen}
				onClose={() => setMembersOpen(false)}
				className={'chat-members-drawer'}
			>
				<div className={'drawer-head'}>
					<span>{t('Room details')}</span>
					<IconButton aria-label={t('Close')} onClick={() => setMembersOpen(false)}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				{rightPanel}
			</Drawer>

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
				onCopyLink={async (id) => {
					const url = `${window.location.origin}/community/rooms/${room.slug}#message-${id}`;
					try {
						await navigator.clipboard.writeText(url);
						await sweetTopSuccessAlert(t('Link copied'));
					} catch {
						await sweetTopSuccessAlert(t('Unable to copy link'));
					}
				}}
				onReport={() => placeholderAction('Report message will be available soon.')}
				onRetry={retryMessage}
				onModeratorDelete={removeMessage}
				onTimeoutUser={() => placeholderAction('Timeout user will be available soon.')}
				onBlockUser={() => placeholderAction('Block user will be available soon.')}
			/>
		</div>
	);
};

export default withLayoutCourse(CommunityChatRoomPage, { title: 'Chat Room — Academics' });
