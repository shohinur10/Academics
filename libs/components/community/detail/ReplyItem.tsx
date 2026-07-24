import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
	CommunityReactionEmoji,
	CommunityReply,
	COMMUNITY_POST_REACTIONS,
	MAX_REPLY_NESTING_DEPTH,
	roleBadgeLabel,
} from '../../../types/community/post';
import ReplyComposer from './ReplyComposer';

interface ReplyItemProps {
	reply: CommunityReply;
	depth: number;
	selfId?: string;
	isModerator: boolean;
	canAccept?: boolean;
	postLocked?: boolean;
	childReplies?: CommunityReply[];
	onReact: (replyId: string, emoji: CommunityReactionEmoji) => void;
	onReply: (reply: CommunityReply) => void;
	onEdit: (reply: CommunityReply, text: string) => Promise<{ ok: boolean }>;
	onDelete: (replyId: string) => void;
	onReport: (replyId: string) => void;
	onAccept?: (replyId: string) => void;
	onLoadMoreChildren?: (parentId: string) => void;
	onOpenThread?: (reply: CommunityReply) => void;
	replyingToId?: string | null;
	onCancelReply?: () => void;
	onSubmitNested?: (text: string, parent: CommunityReply) => Promise<{ ok: boolean }>;
}

const timeLabel = (iso: string) => {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.max(1, Math.round(diff / 60000));
	if (mins < 60) return `${mins}m`;
	const hours = Math.round(mins / 60);
	if (hours < 48) return `${hours}h`;
	return new Date(iso).toLocaleDateString();
};

const ReplyItem = ({
	reply,
	depth,
	selfId,
	isModerator,
	canAccept,
	postLocked,
	childReplies = [],
	onReact,
	onReply,
	onEdit,
	onDelete,
	onReport,
	onAccept,
	onLoadMoreChildren,
	onOpenThread,
	replyingToId,
	onCancelReply,
	onSubmitNested,
}: ReplyItemProps) => {
	const { t } = useTranslation('common');
	const [menuOpen, setMenuOpen] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editText, setEditText] = useState(reply.text);
	const isOwn = Boolean(selfId && selfId === reply.author.id);
	const showNestedComposer = replyingToId === reply.id && depth < MAX_REPLY_NESTING_DEPTH;

	if (reply.deleted) {
		return (
			<article className={'reply-item is-deleted'} aria-label={t('Deleted reply')}>
				<p>{t('This reply was deleted.')}</p>
			</article>
		);
	}

	return (
		<article
			className={`reply-item depth-${Math.min(depth, MAX_REPLY_NESTING_DEPTH)} ${reply.isAccepted ? 'is-accepted' : ''} ${reply.status === 'failed' ? 'is-failed' : ''}`}
			aria-labelledby={`reply-author-${reply.id}`}
		>
			<img src={reply.author.avatar} alt="" className={'reply-avatar'} loading="lazy" />
			<div className={'reply-main'}>
				<header className={'reply-head'}>
					<div>
						<strong id={`reply-author-${reply.id}`}>{reply.author.name}</strong>
						<span className={`role-badge role-${reply.author.role.toLowerCase()}`}>
							{t(roleBadgeLabel(reply.author.role))}
						</span>
						{reply.isAccepted ? <span className={'accepted-badge'}>{t('Accepted answer')}</span> : null}
						<time dateTime={reply.createdAt}>{timeLabel(reply.createdAt)}</time>
						{reply.edited ? <span className={'edited-tag'}>{t('Edited')}</span> : null}
					</div>
					<div className={'reply-menu-wrap'}>
						<button
							type="button"
							className={'icon-btn'}
							aria-label={t('Reply actions')}
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen((v) => !v)}
						>
							<MoreHorizIcon fontSize="small" />
						</button>
						{menuOpen ? (
							<ul className={'reply-menu'} role="menu">
								{isOwn || isModerator ? (
									<li role="menuitem">
										<button
											type="button"
											onClick={() => {
												setEditing(true);
												setEditText(reply.text);
												setMenuOpen(false);
											}}
										>
											{t('Edit')}
										</button>
									</li>
								) : null}
								{isOwn || isModerator ? (
									<li role="menuitem">
										<button
											type="button"
											onClick={() => {
												setMenuOpen(false);
												onDelete(reply.id);
											}}
										>
											{t('Delete')}
										</button>
									</li>
								) : null}
								<li role="menuitem">
									<button
										type="button"
										onClick={() => {
											setMenuOpen(false);
											onReport(reply.id);
										}}
									>
										{t('Report')}
									</button>
								</li>
							</ul>
						) : null}
					</div>
				</header>

				{editing ? (
					<div className={'reply-edit'}>
						<textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} />
						<div className={'composer-actions'}>
							<button type="button" onClick={() => setEditing(false)}>
								{t('Cancel')}
							</button>
							<button
								type="button"
								onClick={async () => {
									const result = await onEdit(reply, editText);
									if (result.ok) setEditing(false);
								}}
							>
								{t('Save')}
							</button>
						</div>
					</div>
				) : (
					<p className={'reply-text'}>{reply.text}</p>
				)}

				{reply.status === 'failed' ? (
					<p className={'reply-failed'} role="status">
						{t('Failed to send.')}{' '}
						<button type="button" onClick={() => onSubmitNested?.(reply.text, { ...reply, id: reply.parentId || reply.id } as CommunityReply)}>
							{t('Retry')}
						</button>
					</p>
				) : null}

				<div className={'reply-actions'}>
					<div className={'reaction-row'} role="group" aria-label={t('Reactions')}>
						{COMMUNITY_POST_REACTIONS.map((emoji) => {
							const current = reply.reactions.find((r) => r.emoji === emoji);
							return (
								<button
									key={emoji}
									type="button"
									className={current?.reactedByMe ? 'is-active' : ''}
									aria-pressed={Boolean(current?.reactedByMe)}
									aria-label={`${emoji} ${current?.count || 0}`}
									onClick={() => onReact(reply.id, emoji)}
								>
									<span aria-hidden="true">{emoji}</span>
									{current?.count ? <span>{current.count}</span> : null}
								</button>
							);
						})}
					</div>
					{!postLocked ? (
						<button type="button" className={'text-action'} onClick={() => onReply(reply)}>
							{t('Reply')}
							{reply.replyCount > 0 ? ` (${reply.replyCount})` : ''}
						</button>
					) : null}
					{canAccept && !reply.parentId && onAccept ? (
						<button type="button" className={'text-action accept'} onClick={() => onAccept(reply.id)}>
							{reply.isAccepted ? t('Accepted') : t('Mark as accepted')}
						</button>
					) : null}
				</div>

				{showNestedComposer && onSubmitNested ? (
					<ReplyComposer
						replyToName={reply.author.name}
						onCancelReply={onCancelReply}
						onSubmit={(text) => onSubmitNested(text, reply)}
						autoFocus
					/>
				) : null}

				{childReplies.length > 0 && depth < MAX_REPLY_NESTING_DEPTH ? (
					<div className={'nested-replies'}>
						{childReplies.map((child) => (
							<ReplyItem
								key={child.id}
								reply={child}
								depth={depth + 1}
								selfId={selfId}
								isModerator={isModerator}
								canAccept={false}
								postLocked={postLocked}
								onReact={onReact}
								onReply={(r) => {
									if (depth + 1 >= MAX_REPLY_NESTING_DEPTH && onOpenThread) {
										onOpenThread(r);
										return;
									}
									onReply(r);
								}}
								onEdit={onEdit}
								onDelete={onDelete}
								onReport={onReport}
								replyingToId={replyingToId}
								onCancelReply={onCancelReply}
								onSubmitNested={onSubmitNested}
								onOpenThread={onOpenThread}
							/>
						))}
						{reply.replyCount > childReplies.length ? (
							<button
								type="button"
								className={'view-more-replies'}
								onClick={() => {
									if (onOpenThread) onOpenThread(reply);
									else onLoadMoreChildren?.(reply.id);
								}}
							>
								{t('View more replies')} ({reply.replyCount})
							</button>
						) : null}
					</div>
				) : null}

				{depth >= MAX_REPLY_NESTING_DEPTH && reply.replyCount > 0 ? (
					<button type="button" className={'view-more-replies'} onClick={() => onOpenThread?.(reply)}>
						{t('View more replies')} ({reply.replyCount})
					</button>
				) : null}
			</div>
		</article>
	);
};

export default ReplyItem;
