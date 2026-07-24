/** Study Groups types (mock/API-ready). */

export type StudyGroupLanguage = 'English' | 'Korean' | 'Mixed';

export type StudyGroupLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All levels';

export type StudyGroupGoal =
	| 'Exam prep'
	| 'Speaking'
	| 'Grammar'
	| 'Business'
	| 'Travel'
	| 'Pronunciation'
	| 'General';

export type StudyGroupPrivacy = 'public' | 'private';

export type StudyGroupActivityLevel = 'high' | 'medium' | 'low';

export type StudyGroupIconTone =
	| 'purple'
	| 'blue'
	| 'pink'
	| 'orange'
	| 'teal'
	| 'violet'
	| 'amber'
	| 'rose';

/** Viewer membership relative to a group. */
export type StudyGroupMembershipState = 'none' | 'pending' | 'joined' | 'owner' | 'moderator';

export type StudyGroupMemberRole = 'owner' | 'moderator' | 'member';

export type StudyGroupResourceKind = 'PDF' | 'Vocabulary List' | 'Link' | 'Lesson Notes' | 'Video';

export type StudyGroupEventType = 'speaking' | 'study_meeting' | 'webinar' | 'mock_test';

export type StudyGroupSizeBucket = 'small' | 'medium' | 'large';

export type StudyGroupSort = 'members' | 'activity' | 'newest' | 'name';

export type StudyGroupDetailTab =
	| 'about'
	| 'chat'
	| 'announcements'
	| 'resources'
	| 'events'
	| 'members'
	| 'rules';

export interface StudyGroupMember {
	id: string;
	name: string;
	avatar: string;
	role: StudyGroupMemberRole;
	joinedAt: string;
	contributionLevel: 'high' | 'medium' | 'low';
	online: boolean;
	/** Membership awaiting owner/mod approval. */
	pending?: boolean;
}

export interface StudyGroupAnnouncement {
	id: string;
	title: string;
	body: string;
	authorName: string;
	createdAt: string;
}

export interface StudyGroupResource {
	id: string;
	title: string;
	kind: StudyGroupResourceKind;
	url?: string;
	description?: string;
	addedBy: string;
	addedAt: string;
}

export interface StudyGroupEvent {
	id: string;
	title: string;
	type: StudyGroupEventType;
	datetimeLabel: string;
	description?: string;
}

export interface StudyGroupCreator {
	id: string;
	name: string;
	avatar: string;
}

/** Card + list summary. */
export interface CommunityStudyGroup {
	slug: string;
	name: string;
	description: string;
	memberCount: number;
	iconTone: StudyGroupIconTone;
	avatars: string[];
	language: StudyGroupLanguage;
	level: StudyGroupLevel;
	goal: StudyGroupGoal;
	privacy: StudyGroupPrivacy;
	memberLimit: number;
	tags: string[];
	activityLevel: StudyGroupActivityLevel;
	/** ISO date of last notable activity. */
	lastActiveAt: string;
	coverImage?: string;
	/** Chat room slug reused by community chat channel. */
	chatRoomSlug: string;
}

export interface StudyGroupDetails extends CommunityStudyGroup {
	onlineCount: number;
	creator: StudyGroupCreator;
	rules: string[];
	about: string;
	createdAt: string;
	members: StudyGroupMember[];
	announcements: StudyGroupAnnouncement[];
	resources: StudyGroupResource[];
	events: StudyGroupEvent[];
}

export interface StudyGroupCreateForm {
	name: string;
	description: string;
	language: StudyGroupLanguage;
	level: StudyGroupLevel;
	goal: StudyGroupGoal;
	privacy: StudyGroupPrivacy;
	memberLimit: number;
	tags: string[];
	coverImage: string;
	rulesText: string;
}

export interface StudyGroupFilters {
	query: string;
	language: StudyGroupLanguage | 'all';
	goal: StudyGroupGoal | 'all';
	level: StudyGroupLevel | 'all';
	size: StudyGroupSizeBucket | 'all';
	privacy: StudyGroupPrivacy | 'all';
	activeRecently: boolean;
	sort: StudyGroupSort;
}

export const STUDY_GROUP_LANGUAGES: StudyGroupLanguage[] = ['English', 'Korean', 'Mixed'];

export const STUDY_GROUP_LEVELS: StudyGroupLevel[] = [
	'Beginner',
	'Intermediate',
	'Advanced',
	'All levels',
];

export const STUDY_GROUP_GOALS: StudyGroupGoal[] = [
	'Exam prep',
	'Speaking',
	'Grammar',
	'Business',
	'Travel',
	'Pronunciation',
	'General',
];

export const emptyStudyGroupCreateForm = (): StudyGroupCreateForm => ({
	name: '',
	description: '',
	language: 'English',
	level: 'All levels',
	goal: 'General',
	privacy: 'public',
	memberLimit: 50,
	tags: [],
	coverImage: '',
	rulesText: 'Be respectful\nStay on topic\nNo spam',
});

export const emptyStudyGroupFilters = (): StudyGroupFilters => ({
	query: '',
	language: 'all',
	goal: 'all',
	level: 'all',
	size: 'all',
	privacy: 'all',
	activeRecently: false,
	sort: 'members',
});

export const sizeBucketForCount = (count: number): StudyGroupSizeBucket => {
	if (count < 100) return 'small';
	if (count < 500) return 'medium';
	return 'large';
};

export const slugifyGroupName = (name: string): string =>
	name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 48) || `group-${Date.now()}`;
