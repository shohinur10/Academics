import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
	CommunityPost,
	CommunityReactionEmoji,
	COMMUNITY_POST_REACTIONS,
	postTypeBadge,
	roleBadgeLabel,
} from '../../../types/community/post';

interface PostArticleProps {
	post: CommunityPost;
	isAuthor: boolean;
	isModerator: boolean;
	onReact: (emoji: CommunityReactionEmoji) => void;
	onBookmark: () => void;
	onShare: () => void;
	onReport: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onModerate: (action: 'hide' | 'lock' | 'pin' | 'unhide' | 'unlock' | 'unpin') => void;
}

export const PostArticleHeader = ({
	post,
	isAuthor,
	isModerator,
	onReact,
	onBookmark,
	onShare,
	onReport,
	onEdit,
	onDelete,
	onModerate,
}: PostArticleProps) => {
	const { t } = useTranslation('common');

	return (
		<>
			<nav className={'post-breadcrumb'} aria-label={t('Breadcrumb')}>
				<Link href="/community">{t('Community')}</Link>
				<span aria-hidden="true">/</span>
				<Link href={`/community/rooms/${post.roomSlug}`}>{t(post.roomName)}</Link>
				<span aria-hidden="true">/</span>
				<span>{t(post.title)}</span>
			</nav>

			<div className={'post-meta-row'}>
				<span className={`type-badge type-${post.type}`}>{t(postTypeBadge(post.type))}</span>
				{post.pinned ? <span className={'mod-badge'}>{t('Pinned')}</span> : null}
				{post.locked ? <span className={'mod-badge'}>{t('Locked')}</span> : null}
				{post.hidden ? <span className={'mod-badge danger'}>{t('Hidden')}</span> : null}
			</div>

			<h1>{post.title}</h1>

			<div className={'post-author-row'}>
				<img src={post.author.avatar} alt="" />
				<div>
					<strong>{post.author.name}</strong>
					<span className={`role-badge role-${post.author.role.toLowerCase()}`}>
						{t(roleBadgeLabel(post.author.role))}
					</span>
					<p>
						<Link href={`/community/rooms/${post.roomSlug}`}>{t(post.roomName)}</Link>
						{' · '}
						<time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleString()}</time>
					</p>
				</div>
			</div>

			{post.tags.length > 0 ? (
				<ul className={'post-tags'}>
					{post.tags.map((tag) => (
						<li key={tag}>{tag}</li>
					))}
				</ul>
			) : null}

			<div className={'post-toolbar'}>
				<div className={'reaction-row'} role="group" aria-label={t('Reactions')}>
					{COMMUNITY_POST_REACTIONS.map((emoji) => {
						const current = post.reactions.find((r) => r.emoji === emoji);
						return (
							<button
								key={emoji}
								type="button"
								className={current?.reactedByMe ? 'is-active' : ''}
								aria-pressed={Boolean(current?.reactedByMe)}
								aria-label={`${emoji} ${current?.count || 0}`}
								onClick={() => onReact(emoji)}
							>
								<span aria-hidden="true">{emoji}</span>
								{current?.count ? <span>{current.count}</span> : null}
							</button>
						);
					})}
				</div>
				<div className={'toolbar-actions'}>
					<button type="button" aria-pressed={post.bookmarkedByMe} onClick={onBookmark}>
						{post.bookmarkedByMe ? t('Bookmarked') : t('Bookmark')}
					</button>
					<button type="button" onClick={onShare}>
						{t('Share')}
					</button>
					<button type="button" onClick={onReport}>
						{t('Report')}
					</button>
					{isAuthor ? (
						<>
							<button type="button" onClick={onEdit}>
								{t('Edit')}
							</button>
							<button type="button" className={'danger'} onClick={onDelete}>
								{t('Delete')}
							</button>
						</>
					) : null}
					{isModerator ? (
						<>
							<button type="button" onClick={() => onModerate(post.hidden ? 'unhide' : 'hide')}>
								{post.hidden ? t('Unhide') : t('Hide')}
							</button>
							<button type="button" onClick={() => onModerate(post.locked ? 'unlock' : 'lock')}>
								{post.locked ? t('Unlock') : t('Lock')}
							</button>
							<button type="button" onClick={() => onModerate(post.pinned ? 'unpin' : 'pin')}>
								{post.pinned ? t('Unpin') : t('Pin')}
							</button>
							{!isAuthor ? (
								<button type="button" className={'danger'} onClick={onDelete}>
									{t('Delete')}
								</button>
							) : null}
						</>
					) : null}
				</div>
			</div>
		</>
	);
};

export const PostBody = ({ post }: { post: CommunityPost }) => (
	<div className={'post-body'}>
		<p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
		{post.attachments?.length ? (
			<ul className={'post-attachments'}>
				{post.attachments.map((file) => (
					<li key={file.id}>
						{file.url ? (
							<a href={file.url} target="_blank" rel="noopener noreferrer">
								{file.name}
							</a>
						) : (
							<span>{file.name}</span>
						)}
					</li>
				))}
			</ul>
		) : null}
	</div>
);

export const PollPanel = ({
	post,
	onVote,
	busy,
}: {
	post: CommunityPost;
	onVote: (optionIds: string[]) => void;
	busy?: boolean;
}) => {
	const { t } = useTranslation('common');
	const options = post.pollOptions || [];
	const total = options.reduce((sum, o) => sum + o.votes, 0);
	const voted = (post.myPollVotes || []).length > 0;
	const ended = Boolean(post.pollEndsAt && new Date(post.pollEndsAt).getTime() < Date.now());
	const showResults = voted || ended || post.pollShowResultsBeforeVote;
	const [selected, setSelected] = useState<string[]>(post.myPollVotes || []);

	const remaining = (() => {
		if (!post.pollEndsAt) return null;
		const ms = new Date(post.pollEndsAt).getTime() - Date.now();
		if (ms <= 0) return t('Ended');
		const days = Math.ceil(ms / 86400000);
		return `${days}d ${t('remaining')}`;
	})();

	const toggle = (id: string) => {
		if (voted && !post.pollAllowMultiple) return;
		if (ended) return;
		if (post.pollAllowMultiple) {
			setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
		} else {
			setSelected([id]);
		}
	};

	return (
		<section className={'poll-panel'} aria-labelledby="poll-heading">
			<h2 id="poll-heading" className={'visually-hidden'}>
				{t('Poll')}
			</h2>
			<p className={'poll-stats'}>
				{total} {t('votes')}
				{remaining ? ` · ${remaining}` : ''}
			</p>
			<ul className={'poll-options'}>
				{options.map((option) => {
					const pct = total ? Math.round((option.votes / total) * 100) : 0;
					const isSelected = selected.includes(option.id) || (post.myPollVotes || []).includes(option.id);
					return (
						<li key={option.id}>
							<button
								type="button"
								className={`poll-option ${isSelected ? 'is-selected' : ''}`}
								aria-pressed={isSelected}
								disabled={ended || (voted && !post.pollAllowMultiple) || busy}
								onClick={() => toggle(option.id)}
							>
								<span className={'option-label'}>{option.label}</span>
								{showResults ? (
									<span className={'option-meta'}>
										{pct}% · {option.votes}
									</span>
								) : null}
								{showResults ? (
									<span className={'option-bar'} style={{ width: `${pct}%` }} aria-hidden="true" />
								) : null}
							</button>
						</li>
					);
				})}
			</ul>
			{!ended && !(voted && !post.pollAllowMultiple) ? (
				<button
					type="button"
					className={'vote-btn'}
					disabled={!selected.length || busy}
					onClick={() => onVote(selected)}
				>
					{busy ? t('Voting…') : t('Submit vote')}
				</button>
			) : null}
			{voted ? (
				<p className={'voted-note'} role="status">
					{t('Your vote is recorded.')}
				</p>
			) : null}
		</section>
	);
};

export const ResourcePanel = ({ post }: { post: CommunityPost }) => {
	const { t } = useTranslation('common');
	const url = post.resourceUrl;
	const safe = Boolean(url && /^https?:\/\//i.test(url));
	const canDownload = safe || Boolean(post.attachments?.some((a) => a.status === 'success' && a.url));

	return (
		<section className={'resource-panel'} aria-labelledby="resource-heading">
			<h2 id="resource-heading">{t('Resource')}</h2>
			<p className={'resource-type'}>
				{post.resourceType ? t(post.resourceType) : t('Resource')}
				{post.resourceTopic ? ` · ${post.resourceTopic}` : ''}
			</p>
			{post.resourceFileName ? (
				<p className={'file-info'}>
					{post.resourceFileName}
					{post.resourceFileSize ? ` · ${Math.round(post.resourceFileSize / 1024)} KB` : ''}
				</p>
			) : null}
			<div className={'resource-preview'}>
				{safe ? (
					<a href={url} target="_blank" rel="noopener noreferrer">
						{url}
					</a>
				) : (
					<p>{t('No external link available.')}</p>
				)}
			</div>
			{canDownload && safe ? (
				<a className={'download-btn'} href={url} target="_blank" rel="noopener noreferrer" download>
					{t('Open / Download')}
				</a>
			) : null}
			{post.tags.length ? (
				<ul className={'post-tags'}>
					{post.tags.map((tag) => (
						<li key={tag}>{tag}</li>
					))}
				</ul>
			) : null}
		</section>
	);
};

export const SuccessPanel = ({ post }: { post: CommunityPost }) => {
	const { t } = useTranslation('common');
	return (
		<section className={'success-panel'} aria-labelledby="success-heading">
			<h2 id="success-heading">{t('Success Story')}</h2>
			{post.goal ? (
				<p>
					<strong>{t('Goal')}:</strong> {post.goal}
				</p>
			) : null}
			{post.result ? (
				<p>
					<strong>{t('Result')}:</strong> {post.result}
				</p>
			) : null}
			{(post.beforeMetric || post.afterMetric) && (
				<p className={'metric-row'}>
					<span>{post.beforeMetric || '—'}</span>
					<span aria-hidden="true">→</span>
					<span>{post.afterMetric || '—'}</span>
				</p>
			)}
		</section>
	);
};

export const RelatedContent = ({
	post,
	relatedPosts,
}: {
	post: CommunityPost;
	relatedPosts: CommunityPost[];
}) => {
	const { t } = useTranslation('common');
	const related = post.related;
	return (
		<aside className={'related-content'} aria-labelledby="related-heading">
			<h2 id="related-heading">{t('Related')}</h2>
			{relatedPosts.length > 0 ? (
				<div className={'related-block'}>
					<h3>{t('Related discussions')}</h3>
					<ul>
						{relatedPosts.map((item) => (
							<li key={item.id}>
								<Link href={`/community/posts/${item.slug}`}>{item.title}</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
			{related?.courseId || related?.courseTitle ? (
				<div className={'related-block'}>
					<h3>{t('Related course')}</h3>
					<p>
						{related.courseId ? (
							<Link href={`/course/detail?id=${encodeURIComponent(related.courseId)}`}>
								{related.courseTitle || related.courseId}
							</Link>
						) : (
							related.courseTitle
						)}
					</p>
				</div>
			) : null}
			{related?.instructorId || related?.instructorName ? (
				<div className={'related-block'}>
					<h3>{t('Relevant instructor')}</h3>
					<p>
						{related.instructorId ? (
							<Link href={`/instructor/detail?id=${encodeURIComponent(related.instructorId)}`}>
								{related.instructorName || related.instructorId}
							</Link>
						) : (
							related.instructorName
						)}
					</p>
				</div>
			) : null}
			{related?.studyGroupSlug ? (
				<div className={'related-block'}>
					<h3>{t('Relevant study group')}</h3>
					<p>
						<Link href={`/community/groups/${related.studyGroupSlug}`}>
							{related.studyGroupName || related.studyGroupSlug}
						</Link>
					</p>
				</div>
			) : null}
		</aside>
	);
};

export const ReportDialog = ({
	open,
	onClose,
	onSubmit,
}: {
	open: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
}) => {
	const { t } = useTranslation('common');
	const [reason, setReason] = useState('spam');
	if (!open) return null;
	return (
		<div className={'report-dialog-backdrop'} role="presentation" onClick={onClose}>
			<div
				className={'report-dialog'}
				role="dialog"
				aria-modal="true"
				aria-labelledby="report-title"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="report-title">{t('Report')}</h2>
				<label htmlFor="report-reason">{t('Reason')}</label>
				<select id="report-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
					<option value="spam">{t('Spam')}</option>
					<option value="harassment">{t('Harassment')}</option>
					<option value="misinformation">{t('Misinformation')}</option>
					<option value="other">{t('Other')}</option>
				</select>
				<div className={'composer-actions'}>
					<button type="button" onClick={onClose}>
						{t('Cancel')}
					</button>
					<button
						type="button"
						onClick={() => {
							onSubmit(reason);
							onClose();
						}}
					>
						{t('Submit report')}
					</button>
				</div>
			</div>
		</div>
	);
};
