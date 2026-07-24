/** Community discussion post + threaded reply types. */

import type { CommunityAttachment, CommunityContentType, CommunityResourceType } from './create';

export type CommunityPostRole = 'STUDENT' | 'INSTRUCTOR' | 'MODERATOR' | 'ADMIN';

export type CommunityReplySort = 'helpful' | 'newest' | 'oldest';

export type CommunityReactionEmoji = '👍' | '❤️' | '🎉' | '💡' | '🙏';

export interface CommunityPostAuthor {
	id: string;
	name: string;
	avatar: string;
	role: CommunityPostRole;
}

export interface CommunityPostReaction {
	emoji: CommunityReactionEmoji;
	count: number;
	reactedByMe: boolean;
}

export interface CommunityPollOption {
	id: string;
	label: string;
	votes: number;
}

export interface CommunityPostRelated {
	courseId?: string;
	courseTitle?: string;
	instructorId?: string;
	instructorName?: string;
	studyGroupSlug?: string;
	studyGroupName?: string;
}

export interface CommunityPost {
	id: string;
	slug: string;
	type: CommunityContentType;
	title: string;
	body: string;
	roomSlug: string;
	roomName: string;
	tags: string[];
	createdAt: string;
	updatedAt?: string;
	author: CommunityPostAuthor;
	attachments: CommunityAttachment[];
	reactions: CommunityPostReaction[];
	replyCount: number;
	bookmarkedByMe: boolean;
	/** Moderation */
	hidden?: boolean;
	locked?: boolean;
	pinned?: boolean;
	/** Question */
	acceptedReplyId?: string | null;
	/** Poll */
	pollOptions?: CommunityPollOption[];
	pollEndsAt?: string;
	pollAllowMultiple?: boolean;
	pollShowResultsBeforeVote?: boolean;
	myPollVotes?: string[];
	/** Resource */
	resourceType?: CommunityResourceType;
	resourceUrl?: string;
	resourceTopic?: string;
	resourceFileName?: string;
	resourceFileSize?: number;
	/** Success */
	goal?: string;
	result?: string;
	beforeMetric?: string;
	afterMetric?: string;
	related?: CommunityPostRelated;
}

export interface CommunityReply {
	id: string;
	postId: string;
	parentId: string | null;
	author: CommunityPostAuthor;
	text: string;
	createdAt: string;
	updatedAt?: string;
	edited?: boolean;
	reactions: CommunityPostReaction[];
	replyCount: number;
	helpfulCount: number;
	/** Question answers can be accepted */
	isAccepted?: boolean;
	/** Soft-deleted / hidden */
	deleted?: boolean;
	status?: 'pending' | 'sent' | 'failed';
	clientId?: string;
}

export interface CommunityReplyPage {
	items: CommunityReply[];
	nextCursor: string | null;
	hasMore: boolean;
}

export const COMMUNITY_POST_REACTIONS: CommunityReactionEmoji[] = ['👍', '❤️', '🎉', '💡', '🙏'];

export const MAX_REPLY_NESTING_DEPTH = 2;

export const slugifyPostTitle = (title: string): string =>
	title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 60) || `post-${Date.now()}`;

export const postTypeBadge = (type: CommunityContentType): string => {
	switch (type) {
		case 'question':
			return 'Question';
		case 'poll':
			return 'Poll';
		case 'resource':
			return 'Resource';
		case 'success':
			return 'Success Story';
		default:
			return 'Discussion';
	}
};

export const roleBadgeLabel = (role: CommunityPostRole): string => {
	switch (role) {
		case 'ADMIN':
			return 'Admin';
		case 'MODERATOR':
			return 'Moderator';
		case 'INSTRUCTOR':
			return 'Instructor';
		default:
			return 'Student';
	}
};
