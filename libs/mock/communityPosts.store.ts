import { makeVar } from '@apollo/client';
import {
	CommunityAttachment,
	CommunityContentType,
	CommunityCreateFormState,
} from '../types/community/create';
import {
	CommunityPost,
	CommunityPostAuthor,
	CommunityPostReaction,
	CommunityReactionEmoji,
	CommunityReply,
	CommunityReplyPage,
	CommunityReplySort,
	postTypeBadge,
	slugifyPostTitle,
} from '../types/community/post';
import {
	COMMUNITY_SEED_POSTS,
	COMMUNITY_SEED_REPLIES,
	getSeedPostBySlug,
} from './communityPosts.mock';
import { COMMUNITY_ROOMS } from './community.mock';

const POSTS_KEY = 'academics:community:userPosts';
const REPLIES_KEY = 'academics:community:postReplies';
const OVERRIDES_KEY = 'academics:community:postOverrides';
const VOTES_KEY = 'academics:community:pollVotes';
const BOOKMARKS_KEY = 'academics:community:postBookmarks';

export type PostActionResult<T = undefined> =
	| { ok: true; data?: T; localOnly: true }
	| { ok: false; error: string };

type PostOverrides = Record<string, Partial<CommunityPost>>;
type PollVotesMap = Record<string, string[]>;
type BookmarksMap = Record<string, boolean>;

export const communityPostsRevisionVar = makeVar(0);

const bump = () => communityPostsRevisionVar(communityPostsRevisionVar() + 1);

const readJson = <T>(key: string, fallback: T): T => {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = sessionStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
};

const writeJson = (key: string, value: unknown) => {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(key, JSON.stringify(value));
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const readUserPosts = (): CommunityPost[] => readJson(POSTS_KEY, []);
const writeUserPosts = (posts: CommunityPost[]) => writeJson(POSTS_KEY, posts);

const readReplyBag = (): CommunityReply[] => {
	const stored = readJson<CommunityReply[]>(REPLIES_KEY, []);
	if (stored.length) return stored;
	return [...COMMUNITY_SEED_REPLIES];
};

const writeReplyBag = (replies: CommunityReply[]) => writeJson(REPLIES_KEY, replies);

const ensureRepliesHydrated = () => {
	if (typeof window === 'undefined') return;
	if (!sessionStorage.getItem(REPLIES_KEY)) {
		writeReplyBag([...COMMUNITY_SEED_REPLIES]);
	}
};

const readOverrides = (): PostOverrides => readJson(OVERRIDES_KEY, {});
const writeOverrides = (map: PostOverrides) => writeJson(OVERRIDES_KEY, map);

const readVotes = (): PollVotesMap => readJson(VOTES_KEY, {});
const writeVotes = (map: PollVotesMap) => writeJson(VOTES_KEY, map);

const readBookmarks = (): BookmarksMap => readJson(BOOKMARKS_KEY, {});
const writeBookmarks = (map: BookmarksMap) => writeJson(BOOKMARKS_KEY, map);

const roomNameFor = (slug: string) => COMMUNITY_ROOMS.find((r) => r.slug === slug)?.name || slug;

const applyOverrides = (post: CommunityPost): CommunityPost => {
	const overrides = readOverrides()[post.id] || {};
	const bookmarks = readBookmarks();
	const votes = readVotes()[post.id];
	return {
		...post,
		...overrides,
		bookmarkedByMe: bookmarks[post.id] ?? post.bookmarkedByMe,
		myPollVotes: votes ?? post.myPollVotes ?? [],
		replyCount: countTopLevelReplies(post.id),
	};
};

const countTopLevelReplies = (postId: string) =>
	readReplyBag().filter((r) => r.postId === postId && !r.parentId && !r.deleted).length;

export const listCommunityPosts = (): CommunityPost[] => {
	ensureRepliesHydrated();
	const bySlug = new Map<string, CommunityPost>();
	[...COMMUNITY_SEED_POSTS, ...readUserPosts()].forEach((p) => {
		bySlug.set(p.slug, applyOverrides(p));
	});
	return Array.from(bySlug.values()).sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
};

export const getCommunityPostBySlug = (slugOrId: string): CommunityPost | null => {
	ensureRepliesHydrated();
	const user = readUserPosts().find((p) => p.slug === slugOrId || p.id === slugOrId);
	if (user) return applyOverrides(user);
	const seed = getSeedPostBySlug(slugOrId);
	return seed ? applyOverrides(seed) : null;
};

/** @deprecated Prefer getCommunityPostBySlug — kept for legacy detail redirects. */
export const getCreatedPostById = (id: string): CommunityPost | null => getCommunityPostBySlug(id);

export const createCommunityPost = async (
	form: CommunityCreateFormState,
	author: CommunityPostAuthor,
): Promise<PostActionResult<CommunityPost>> => {
	await delay(450);

	if (form.type === 'poll') {
		const options = form.pollOptions.map((o) => o.trim()).filter(Boolean);
		if (options.length < 2) return { ok: false, error: 'Poll requires at least 2 options.' };
		const unique = new Set(options.map((o) => o.toLowerCase()));
		if (unique.size !== options.length) return { ok: false, error: 'Poll options must be unique.' };
	}

	const successAttachments = form.attachments.filter((a) => a.status === 'success');
	if (form.type === 'resource' && !form.resourceUrl.trim() && successAttachments.length === 0) {
		return { ok: false, error: 'Add a resource URL or attachment.' };
	}

	const id = `cpost-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
	let slug = slugifyPostTitle(form.title);
	if (getCommunityPostBySlug(slug)) slug = `${slug}-${id.slice(-5)}`;

	const durationMs: Record<string, number> = {
		'1d': 86400000,
		'3d': 3 * 86400000,
		'7d': 7 * 86400000,
		'14d': 14 * 86400000,
		'30d': 30 * 86400000,
	};

	const post: CommunityPost = {
		id,
		slug,
		type: form.type,
		title: form.title.trim(),
		body: form.body.trim(),
		roomSlug: form.roomSlug,
		roomName: roomNameFor(form.roomSlug),
		tags: form.tags,
		createdAt: new Date().toISOString(),
		author,
		attachments: successAttachments,
		reactions: [],
		replyCount: 0,
		bookmarkedByMe: false,
		pollOptions:
			form.type === 'poll'
				? form.pollOptions
						.map((o) => o.trim())
						.filter(Boolean)
						.map((label, i) => ({ id: `opt-${i}`, label, votes: 0 }))
				: undefined,
		pollEndsAt:
			form.type === 'poll'
				? new Date(Date.now() + (durationMs[form.pollDuration] || durationMs['7d'])).toISOString()
				: undefined,
		pollAllowMultiple: form.type === 'poll' ? form.allowMultiple : undefined,
		pollShowResultsBeforeVote: form.type === 'poll' ? form.showResultsBeforeVote : undefined,
		myPollVotes: [],
		resourceType: form.type === 'resource' ? form.resourceType : undefined,
		resourceUrl: form.type === 'resource' ? form.resourceUrl.trim() || successAttachments[0]?.url : undefined,
		resourceTopic: form.type === 'resource' ? form.resourceTopic : undefined,
		resourceFileName: form.type === 'resource' ? successAttachments[0]?.name : undefined,
		resourceFileSize: form.type === 'resource' ? successAttachments[0]?.size : undefined,
		goal: form.type === 'success' ? form.goal.trim() : undefined,
		result: form.type === 'success' ? form.result.trim() : undefined,
		beforeMetric: form.type === 'success' ? form.beforeMetric.trim() : undefined,
		afterMetric: form.type === 'success' ? form.afterMetric.trim() : undefined,
		related: {
			courseId: form.relatedCourseId.trim() || undefined,
			courseTitle: form.relatedCourseId.trim() || undefined,
			instructorId: form.relatedInstructorId.trim() || undefined,
			instructorName: form.relatedInstructorId.trim() || undefined,
		},
	};

	writeUserPosts([post, ...readUserPosts()].slice(0, 40));
	bump();
	return { ok: true, data: post, localOnly: true };
};

export const updateCommunityPost = async (params: {
	slug: string;
	patch: Partial<Pick<CommunityPost, 'title' | 'body' | 'tags'>>;
	actorId: string;
	isModerator: boolean;
}): Promise<PostActionResult<CommunityPost>> => {
	await delay(280);
	const post = getCommunityPostBySlug(params.slug);
	if (!post) return { ok: false, error: 'Post not found.' };
	if (post.author.id !== params.actorId && !params.isModerator) {
		return { ok: false, error: 'You can only edit your own posts.' };
	}
	if (post.locked && !params.isModerator) return { ok: false, error: 'This post is locked.' };

	const next = { ...post, ...params.patch, updatedAt: new Date().toISOString() };
	upsertPost(next);
	bump();
	return { ok: true, data: next, localOnly: true };
};

export const deleteCommunityPost = async (params: {
	slug: string;
	actorId: string;
	isModerator: boolean;
}): Promise<PostActionResult> => {
	await delay(280);
	const post = getCommunityPostBySlug(params.slug);
	if (!post) return { ok: false, error: 'Post not found.' };
	if (post.author.id !== params.actorId && !params.isModerator) {
		return { ok: false, error: 'You can only delete your own posts.' };
	}
	writeUserPosts(readUserPosts().filter((p) => p.id !== post.id));
	const overrides = readOverrides();
	overrides[post.id] = { ...overrides[post.id], hidden: true };
	writeOverrides(overrides);
	bump();
	return { ok: true, localOnly: true };
};

export const moderateCommunityPost = async (params: {
	slug: string;
	action: 'hide' | 'lock' | 'pin' | 'unhide' | 'unlock' | 'unpin';
	isModerator: boolean;
}): Promise<PostActionResult<CommunityPost>> => {
	await delay(220);
	if (!params.isModerator) return { ok: false, error: 'Moderator permission required.' };
	const post = getCommunityPostBySlug(params.slug);
	if (!post) return { ok: false, error: 'Post not found.' };
	const patch: Partial<CommunityPost> = {};
	if (params.action === 'hide') patch.hidden = true;
	if (params.action === 'unhide') patch.hidden = false;
	if (params.action === 'lock') patch.locked = true;
	if (params.action === 'unlock') patch.locked = false;
	if (params.action === 'pin') patch.pinned = true;
	if (params.action === 'unpin') patch.pinned = false;
	const next = { ...post, ...patch };
	upsertPost(next);
	bump();
	return { ok: true, data: next, localOnly: true };
};

export const togglePostReaction = async (params: {
	slug: string;
	emoji: CommunityReactionEmoji;
	userId: string;
}): Promise<PostActionResult<CommunityPost>> => {
	await delay(120);
	if (!params.userId) return { ok: false, error: 'Sign in to react.' };
	const post = getCommunityPostBySlug(params.slug);
	if (!post) return { ok: false, error: 'Post not found.' };
	const reactions = toggleReactionList(post.reactions, params.emoji);
	const next = { ...post, reactions };
	upsertPost(next);
	bump();
	return { ok: true, data: next, localOnly: true };
};

export const togglePostBookmark = async (params: {
	slug: string;
	userId: string;
}): Promise<PostActionResult<boolean>> => {
	await delay(120);
	if (!params.userId) return { ok: false, error: 'Sign in to bookmark.' };
	const post = getCommunityPostBySlug(params.slug);
	if (!post) return { ok: false, error: 'Post not found.' };
	const map = readBookmarks();
	const next = !(map[post.id] ?? post.bookmarkedByMe);
	map[post.id] = next;
	writeBookmarks(map);
	bump();
	return { ok: true, data: next, localOnly: true };
};

/**
 * Poll voting — single selection by default; no duplicate votes unless allowMultiple.
 * TODO(backend): replace with GraphQL castPollVote.
 */
export const castPollVote = async (params: {
	slug: string;
	optionIds: string[];
	userId: string;
}): Promise<PostActionResult<CommunityPost>> => {
	await delay(220);
	if (!params.userId) return { ok: false, error: 'Sign in to vote.' };
	const post = getCommunityPostBySlug(params.slug);
	if (!post || post.type !== 'poll' || !post.pollOptions) return { ok: false, error: 'Poll not found.' };
	if (post.pollEndsAt && new Date(post.pollEndsAt).getTime() < Date.now()) {
		return { ok: false, error: 'This poll has ended.' };
	}

	const existing = readVotes()[post.id] || post.myPollVotes || [];
	if (existing.length && !post.pollAllowMultiple) {
		return { ok: false, error: 'You already voted in this poll.' };
	}

	const optionIds = params.optionIds.filter((id) => post.pollOptions!.some((o) => o.id === id));
	if (!optionIds.length) return { ok: false, error: 'Select a valid option.' };
	if (!post.pollAllowMultiple && optionIds.length > 1) {
		return { ok: false, error: 'Only one option is allowed.' };
	}

	const votesMap = readVotes();
	const previous = votesMap[post.id] || [];
	votesMap[post.id] = post.pollAllowMultiple ? Array.from(new Set([...previous, ...optionIds])) : optionIds;
	writeVotes(votesMap);

	const newlyAdded = optionIds.filter((id) => !previous.includes(id));
	const options = post.pollOptions.map((o) =>
		newlyAdded.includes(o.id) ? { ...o, votes: o.votes + 1 } : o,
	);
	const next = { ...post, pollOptions: options, myPollVotes: votesMap[post.id] };
	upsertPost(next);
	bump();
	return { ok: true, data: next, localOnly: true };
};

export const getRepliesPage = (params: {
	postId: string;
	parentId?: string | null;
	sort: CommunityReplySort;
	cursor?: string | null;
	limit?: number;
}): CommunityReplyPage => {
	ensureRepliesHydrated();
	const parentId = params.parentId ?? null;
	const limit = params.limit ?? 8;
	let items = readReplyBag().filter(
		(r) => r.postId === params.postId && r.parentId === parentId && !r.deleted,
	);

	items = [...items].sort((a, b) => {
		if (a.isAccepted && !b.isAccepted) return -1;
		if (!a.isAccepted && b.isAccepted) return 1;
		if (params.sort === 'helpful') return b.helpfulCount - a.helpfulCount;
		if (params.sort === 'oldest') {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	let start = 0;
	if (params.cursor) {
		const idx = items.findIndex((r) => r.id === params.cursor);
		start = idx >= 0 ? idx + 1 : 0;
	}
	const slice = items.slice(start, start + limit);
	const last = slice[slice.length - 1];
	const hasMore = start + limit < items.length;
	return {
		items: slice,
		nextCursor: hasMore && last ? last.id : null,
		hasMore,
	};
};

export const createReply = async (params: {
	postId: string;
	parentId: string | null;
	text: string;
	author: CommunityPostAuthor;
	clientId?: string;
}): Promise<PostActionResult<CommunityReply>> => {
	await delay(280);
	const post = getCommunityPostBySlug(params.postId) || listCommunityPosts().find((p) => p.id === params.postId);
	if (!post) return { ok: false, error: 'Post not found.' };
	if (post.locked) return { ok: false, error: 'This post is locked.' };
	if (!params.author.id) return { ok: false, error: 'Sign in to reply.' };
	const text = params.text.trim();
	if (!text) return { ok: false, error: 'Reply cannot be empty.' };

	/* Soft client rate-limit feedback only — backend must enforce. */
	const recentKey = `reply-rl-${params.author.id}`;
	const last = Number(sessionStorage.getItem(recentKey) || 0);
	const now = Date.now();
	if (now - last < 500) {
		return { ok: false, error: 'You are sending replies too quickly. Please wait a moment.' };
	}
	sessionStorage.setItem(recentKey, String(now));

	const reply: CommunityReply = {
		id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		clientId: params.clientId,
		postId: post.id,
		parentId: params.parentId,
		author: params.author,
		text,
		createdAt: new Date().toISOString(),
		reactions: [],
		replyCount: 0,
		helpfulCount: 0,
		status: 'sent',
	};

	const bag = readReplyBag();
	if (params.parentId) {
		const parent = bag.find((r) => r.id === params.parentId);
		if (parent) parent.replyCount += 1;
	}
	writeReplyBag([reply, ...bag]);
	bump();
	return { ok: true, data: reply, localOnly: true };
};

export const updateReply = async (params: {
	replyId: string;
	text: string;
	actorId: string;
	isModerator: boolean;
}): Promise<PostActionResult<CommunityReply>> => {
	await delay(200);
	const bag = readReplyBag();
	const reply = bag.find((r) => r.id === params.replyId);
	if (!reply || reply.deleted) return { ok: false, error: 'Reply not found.' };
	if (reply.author.id !== params.actorId && !params.isModerator) {
		return { ok: false, error: 'You can only edit your own replies.' };
	}
	reply.text = params.text.trim();
	reply.edited = true;
	reply.updatedAt = new Date().toISOString();
	writeReplyBag([...bag]);
	bump();
	return { ok: true, data: reply, localOnly: true };
};

export const deleteReply = async (params: {
	replyId: string;
	actorId: string;
	isModerator: boolean;
}): Promise<PostActionResult> => {
	await delay(200);
	const bag = readReplyBag();
	const reply = bag.find((r) => r.id === params.replyId);
	if (!reply) return { ok: false, error: 'Reply not found.' };
	if (reply.author.id !== params.actorId && !params.isModerator) {
		return { ok: false, error: 'You can only delete your own replies.' };
	}
	reply.deleted = true;
	if (reply.parentId) {
		const parent = bag.find((r) => r.id === reply.parentId);
		if (parent && parent.replyCount > 0) parent.replyCount -= 1;
	}
	writeReplyBag([...bag]);
	bump();
	return { ok: true, localOnly: true };
};

export const toggleReplyReaction = async (params: {
	replyId: string;
	emoji: CommunityReactionEmoji;
	userId: string;
}): Promise<PostActionResult<CommunityReply>> => {
	await delay(100);
	if (!params.userId) return { ok: false, error: 'Sign in to react.' };
	const bag = readReplyBag();
	const reply = bag.find((r) => r.id === params.replyId);
	if (!reply || reply.deleted) return { ok: false, error: 'Reply not found.' };
	reply.reactions = toggleReactionList(reply.reactions, params.emoji);
	const thumbs = reply.reactions.find((r) => r.emoji === '👍');
	reply.helpfulCount = thumbs?.count ?? reply.helpfulCount;
	writeReplyBag([...bag]);
	bump();
	return { ok: true, data: reply, localOnly: true };
};

export const acceptReply = async (params: {
	postSlug: string;
	replyId: string;
	actorId: string;
}): Promise<PostActionResult<CommunityPost>> => {
	await delay(200);
	const post = getCommunityPostBySlug(params.postSlug);
	if (!post || post.type !== 'question') return { ok: false, error: 'Question not found.' };
	if (post.author.id !== params.actorId) {
		return { ok: false, error: 'Only the question author can accept an answer.' };
	}
	const bag = readReplyBag();
	bag.forEach((r) => {
		if (r.postId === post.id && !r.parentId) r.isAccepted = r.id === params.replyId;
	});
	writeReplyBag(bag);
	const next = { ...post, acceptedReplyId: params.replyId };
	upsertPost(next);
	bump();
	return { ok: true, data: next, localOnly: true };
};

export const getRelatedPosts = (post: CommunityPost, limit = 3): CommunityPost[] =>
	listCommunityPosts()
		.filter((p) => p.id !== post.id && (p.roomSlug === post.roomSlug || p.tags.some((t) => post.tags.includes(t))))
		.slice(0, limit);

export const badgeForCreatedType = (type: CommunityContentType) => postTypeBadge(type);

const upsertPost = (post: CommunityPost) => {
	const users = readUserPosts();
	const idx = users.findIndex((p) => p.id === post.id);
	if (idx >= 0) {
		users[idx] = post;
		writeUserPosts(users);
		return;
	}
	if (getSeedPostBySlug(post.slug)) {
		const overrides = readOverrides();
		overrides[post.id] = {
			title: post.title,
			body: post.body,
			tags: post.tags,
			reactions: post.reactions,
			hidden: post.hidden,
			locked: post.locked,
			pinned: post.pinned,
			acceptedReplyId: post.acceptedReplyId,
			pollOptions: post.pollOptions,
			updatedAt: post.updatedAt,
		};
		writeOverrides(overrides);
		return;
	}
	writeUserPosts([post, ...users].slice(0, 40));
};

const toggleReactionList = (
	list: CommunityPostReaction[],
	emoji: CommunityReactionEmoji,
): CommunityPostReaction[] => {
	const next = [...list];
	const idx = next.findIndex((r) => r.emoji === emoji);
	if (idx < 0) return [...next, { emoji, count: 1, reactedByMe: true }];
	const item = next[idx];
	if (item.reactedByMe) {
		const count = Math.max(0, item.count - 1);
		if (count === 0) return next.filter((_, i) => i !== idx);
		next[idx] = { ...item, count, reactedByMe: false };
	} else {
		next[idx] = { ...item, count: item.count + 1, reactedByMe: true };
	}
	return next;
};

// Re-export attachment type helper for create modal compat
export type { CommunityAttachment };
