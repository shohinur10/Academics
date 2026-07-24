/** Shared create-content types for Community. */

export type CommunityContentType = 'discussion' | 'question' | 'poll' | 'resource' | 'success';

/** Home composer action ids — `post` maps to discussion. */
export type CommunityCreateAction = 'post' | 'question' | 'poll' | 'resource' | 'success';

export type CommunityResourceType = 'PDF' | 'Video' | 'Website' | 'Flashcards' | 'Notes' | 'Vocabulary List';

export type CommunityPollDuration = '1d' | '3d' | '7d' | '14d' | '30d';

export type CommunityAttachmentStatus = 'uploading' | 'success' | 'failure';

export interface CommunityAttachment {
	id: string;
	name: string;
	mimeType: string;
	size: number;
	url?: string;
	progress: number;
	status: CommunityAttachmentStatus;
	error?: string;
}

export interface CommunityCreateFormState {
	type: CommunityContentType;
	title: string;
	body: string;
	roomSlug: string;
	tags: string[];
	attachments: CommunityAttachment[];
	visibility: 'public' | 'members';
	/** Question */
	relatedCourseId: string;
	relatedInstructorId: string;
	/** Poll */
	pollOptions: string[];
	pollDuration: CommunityPollDuration;
	allowMultiple: boolean;
	showResultsBeforeVote: boolean;
	/** Resource */
	resourceType: CommunityResourceType;
	resourceUrl: string;
	resourceTopic: string;
	/** Success story */
	goal: string;
	result: string;
	beforeMetric: string;
	afterMetric: string;
}

export interface CommunityCreatedPost {
	id: string;
	type: CommunityContentType;
	title: string;
	body: string;
	roomSlug: string;
	tags: string[];
	createdAt: string;
	badge?: 'Question' | 'Poll' | 'Resource' | 'Success Story';
	pollOptions?: string[];
	resourceType?: CommunityResourceType;
	resourceUrl?: string;
}

export const COMMUNITY_SUGGESTED_TAGS = [
	'English',
	'Korean',
	'IELTS',
	'TOPIK',
	'Grammar',
	'Speaking',
	'Vocabulary',
	'Business',
	'Travel',
	'Kids',
] as const;

export const COMMUNITY_SAFE_ATTACHMENT_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'application/pdf',
] as const;

/** Client-side upload guard — backend must still enforce size/type. */
export const COMMUNITY_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const mapCreateActionToType = (
	action?: CommunityCreateAction | CommunityContentType | string,
): CommunityContentType => {
	if (!action || action === 'post') return 'discussion';
	if (action === 'discussion' || action === 'question' || action === 'poll' || action === 'resource' || action === 'success') {
		return action;
	}
	return 'discussion';
};

export const createEmptyForm = (type: CommunityContentType = 'discussion'): CommunityCreateFormState => ({
	type,
	title: '',
	body: '',
	roomSlug: 'general-chat',
	tags: [],
	attachments: [],
	visibility: 'public',
	relatedCourseId: '',
	relatedInstructorId: '',
	pollOptions: ['', ''],
	pollDuration: '7d',
	allowMultiple: false,
	showResultsBeforeVote: false,
	resourceType: 'Website',
	resourceUrl: '',
	resourceTopic: '',
	goal: '',
	result: '',
	beforeMetric: '',
	afterMetric: '',
});
