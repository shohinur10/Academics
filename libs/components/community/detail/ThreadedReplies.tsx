import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Drawer, IconButton, MenuItem, Select, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useReactiveVar } from '@apollo/client';
import {
	CommunityPostAuthor,
	CommunityReply,
	CommunityReplySort,
} from '../../../types/community/post';
import {
	createReply,
	deleteReply,
	getRepliesPage,
	toggleReplyReaction,
	updateReply,
	acceptReply,
	communityPostsRevisionVar,
} from '../../../mock/communityPosts.store';
import ReplyComposer from './ReplyComposer';
import ReplyItem from './ReplyItem';

interface ThreadedRepliesProps {
	postId: string;
	postSlug: string;
	postAuthorId: string;
	postType: string;
	locked?: boolean;
	selfAuthor: CommunityPostAuthor | null;
	isModerator: boolean;
	onReport: (replyId: string) => void;
}

const ThreadedReplies = ({
	postId,
	postSlug,
	postAuthorId,
	postType,
	locked,
	selfAuthor,
	isModerator,
	onReport,
}: ThreadedRepliesProps) => {
	const { t } = useTranslation('common');
	const revision = useReactiveVar(communityPostsRevisionVar);
	const isPhone = useMediaQuery('(max-width:767px)');
	const liveRef = useRef<HTMLDivElement>(null);

	const [sort, setSort] = useState<CommunityReplySort>('helpful');
	const [replies, setReplies] = useState<CommunityReply[]>([]);
	const [childrenMap, setChildrenMap] = useState<Record<string, CommunityReply[]>>({});
	const [cursor, setCursor] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [replyingTo, setReplyingTo] = useState<CommunityReply | null>(null);
	const [threadRoot, setThreadRoot] = useState<CommunityReply | null>(null);
	const [threadReplies, setThreadReplies] = useState<CommunityReply[]>([]);
	const [statusMsg, setStatusMsg] = useState('');

	const reload = useCallback(() => {
		const page = getRepliesPage({ postId, parentId: null, sort, limit: 8 });
		setReplies(page.items);
		setCursor(page.nextCursor);
		setHasMore(page.hasMore);
		const map: Record<string, CommunityReply[]> = {};
		page.items.forEach((item) => {
			const kids = getRepliesPage({ postId, parentId: item.id, sort: 'oldest', limit: 3 });
			map[item.id] = kids.items;
		});
		setChildrenMap(map);
	}, [postId, sort]);

	useEffect(() => {
		void revision;
		reload();
	}, [reload, revision]);

	useEffect(() => {
		if (!threadRoot) return;
		const page = getRepliesPage({ postId, parentId: threadRoot.id, sort: 'oldest', limit: 40 });
		setThreadReplies(page.items);
	}, [threadRoot, postId, revision]);

	const announce = (msg: string) => {
		setStatusMsg(msg);
		requestAnimationFrame(() => liveRef.current?.focus());
	};

	const canAccept = postType === 'question' && Boolean(selfAuthor?.id) && selfAuthor?.id === postAuthorId;

	const submitReply = async (text: string, parent: CommunityReply | null) => {
		if (!selfAuthor) return { ok: false };
		const clientId = `tmp-${Date.now()}`;
		const optimistic: CommunityReply = {
			id: clientId,
			clientId,
			postId,
			parentId: parent?.id ?? null,
			author: selfAuthor,
			text,
			createdAt: new Date().toISOString(),
			reactions: [],
			replyCount: 0,
			helpfulCount: 0,
			status: 'pending',
		};

		if (!parent) {
			setReplies((prev) => [optimistic, ...prev]);
		} else {
			setChildrenMap((prev) => ({
				...prev,
				[parent.id]: [...(prev[parent.id] || []), optimistic],
			}));
		}

		const result = await createReply({
			postId,
			parentId: parent?.id ?? null,
			text,
			author: selfAuthor,
			clientId,
		});

		if (!result.ok) {
			const fail = { ...optimistic, status: 'failed' as const };
			if (!parent) {
				setReplies((prev) => prev.map((r) => (r.id === clientId ? fail : r)));
			} else {
				setChildrenMap((prev) => ({
					...prev,
					[parent.id]: (prev[parent.id] || []).map((r) => (r.id === clientId ? fail : r)),
				}));
			}
			announce(result.error);
			return { ok: false };
		}

		setReplyingTo(null);
		reload();
		if (threadRoot) {
			const page = getRepliesPage({ postId, parentId: threadRoot.id, sort: 'oldest', limit: 40 });
			setThreadReplies(page.items);
		}
		announce(t('Reply posted'));
		return { ok: true };
	};

	const loadMore = () => {
		const page = getRepliesPage({ postId, parentId: null, sort, cursor, limit: 8 });
		setReplies((prev) => [...prev, ...page.items]);
		setCursor(page.nextCursor);
		setHasMore(page.hasMore);
		page.items.forEach((item) => {
			const kids = getRepliesPage({ postId, parentId: item.id, sort: 'oldest', limit: 3 });
			setChildrenMap((prev) => ({ ...prev, [item.id]: kids.items }));
		});
	};

	const empty = replies.length === 0;

	return (
		<section className={'threaded-replies'} aria-labelledby="replies-heading">
			<div className={'replies-head'}>
				<h2 id="replies-heading">
					{postType === 'question' ? t('Answers') : t('Replies')}
					<span className={'count'}>{replies.filter((r) => !r.deleted).length}</span>
				</h2>
				<FormControl size="small" className={'sort-control'}>
					<InputLabel id="reply-sort-label">{t('Sort')}</InputLabel>
					<Select
						labelId="reply-sort-label"
						label={t('Sort')}
						value={sort}
						onChange={(e) => setSort(e.target.value as CommunityReplySort)}
					>
						<MenuItem value="helpful">{t('Most Helpful')}</MenuItem>
						<MenuItem value="newest">{t('Newest')}</MenuItem>
						<MenuItem value="oldest">{t('Oldest')}</MenuItem>
					</Select>
				</FormControl>
			</div>

			<div className={'visually-hidden'} ref={liveRef} tabIndex={-1} aria-live="polite">
				{statusMsg}
			</div>

			{locked ? (
				<p className={'locked-note'} role="status">
					{t('This post is locked. New replies are disabled.')}
				</p>
			) : (
				<ReplyComposer
					disabled={!selfAuthor}
					placeholder={selfAuthor ? t('Write a reply…') : t('Sign in to reply')}
					replyToName={replyingTo && !replyingTo.parentId ? null : replyingTo?.author.name}
					onCancelReply={replyingTo ? () => setReplyingTo(null) : undefined}
					onSubmit={(text) => submitReply(text, replyingTo)}
				/>
			)}

			{empty ? (
				<p className={'empty-replies'}>{t('Be the first to join the discussion.')}</p>
			) : (
				<div className={'reply-list'}>
					{replies.map((reply) => (
						<ReplyItem
							key={reply.id}
							reply={reply}
							depth={0}
							selfId={selfAuthor?.id}
							isModerator={isModerator}
							canAccept={canAccept}
							postLocked={locked}
							childReplies={childrenMap[reply.id] || []}
							replyingToId={replyingTo?.id ?? null}
							onCancelReply={() => setReplyingTo(null)}
							onReact={async (id, emoji) => {
								if (!selfAuthor) return;
								await toggleReplyReaction({ replyId: id, emoji, userId: selfAuthor.id });
							}}
							onReply={(r) => setReplyingTo(r)}
							onEdit={async (r, text) => {
								if (!selfAuthor) return { ok: false };
								const result = await updateReply({
									replyId: r.id,
									text,
									actorId: selfAuthor.id,
									isModerator,
								});
								if (result.ok) reload();
								return { ok: result.ok };
							}}
							onDelete={async (id) => {
								if (!selfAuthor) return;
								const confirmed = window.confirm(t('Delete this reply?'));
								if (!confirmed) return;
								await deleteReply({ replyId: id, actorId: selfAuthor.id, isModerator });
								reload();
							}}
							onReport={onReport}
							onAccept={async (id) => {
								if (!selfAuthor) return;
								await acceptReply({ postSlug, replyId: id, actorId: selfAuthor.id });
								reload();
								announce(t('Answer accepted'));
							}}
							onOpenThread={(r) => setThreadRoot(r)}
							onSubmitNested={(text, parent) => submitReply(text, parent)}
						/>
					))}
				</div>
			)}

			{hasMore ? (
				<button type="button" className={'load-more-btn'} onClick={loadMore}>
					{t('Load more')}
				</button>
			) : null}

			<Drawer
				anchor={isPhone ? 'bottom' : 'right'}
				open={Boolean(threadRoot)}
				onClose={() => setThreadRoot(null)}
				className={`reply-thread-drawer ${isPhone ? 'full' : ''}`}
				ModalProps={{ keepMounted: false }}
				PaperProps={
					isPhone
						? { sx: { height: '100%', maxHeight: '100dvh', width: '100%', borderRadius: 0 } }
						: undefined
				}
			>
				<div className={'thread-panel'}>
					<header className={'drawer-head'}>
						<h2>{t('Thread')}</h2>
						<IconButton aria-label={t('Close')} onClick={() => setThreadRoot(null)}>
							<CloseOutlinedIcon />
						</IconButton>
					</header>
					{threadRoot ? (
						<>
							<ReplyItem
								reply={threadRoot}
								depth={0}
								selfId={selfAuthor?.id}
								isModerator={isModerator}
								postLocked={locked}
								onReact={async (id, emoji) => {
									if (!selfAuthor) return;
									await toggleReplyReaction({ replyId: id, emoji, userId: selfAuthor.id });
								}}
								onReply={() => undefined}
								onEdit={async () => ({ ok: false })}
								onDelete={() => undefined}
								onReport={onReport}
							/>
							<div className={'thread-replies'}>
								{threadReplies.map((r) => (
									<ReplyItem
										key={r.id}
										reply={r}
										depth={1}
										selfId={selfAuthor?.id}
										isModerator={isModerator}
										postLocked={locked}
										onReact={async (id, emoji) => {
											if (!selfAuthor) return;
											await toggleReplyReaction({ replyId: id, emoji, userId: selfAuthor.id });
										}}
										onReply={() => undefined}
										onEdit={async (item, text) => {
											if (!selfAuthor) return { ok: false };
											const result = await updateReply({
												replyId: item.id,
												text,
												actorId: selfAuthor.id,
												isModerator,
											});
											return { ok: result.ok };
										}}
										onDelete={async (id) => {
											if (!selfAuthor) return;
											await deleteReply({ replyId: id, actorId: selfAuthor.id, isModerator });
										}}
										onReport={onReport}
									/>
								))}
							</div>
							{!locked && selfAuthor ? (
								<ReplyComposer
									replyToName={threadRoot.author.name}
									onSubmit={(text) => submitReply(text, threadRoot)}
									autoFocus
								/>
							) : null}
						</>
					) : null}
				</div>
			</Drawer>
		</section>
	);
};

export default ThreadedReplies;
