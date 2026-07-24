/** Community Home presentation types (mock/API-ready). */

export type CommunityNavId = 'home' | 'feed' | 'mentions' | 'bookmarks';

export type { CommunityCreateAction, CommunityContentType } from './create';
export { mapCreateActionToType } from './create';

export type {
	CommunityStudyGroup,
	StudyGroupDetails,
	StudyGroupMembershipState,
} from './group';

export type ActivityFeedTab = 'all' | 'following' | 'popular';

export type CommunityActivityType =
	| 'question'
	| 'resource'
	| 'answer'
	| 'joined_group'
	| 'challenge'
	| 'success';

export interface CommunityStats {
	members: number;
	discussions: number;
	answers: number;
	studyGroups: number;
}

export interface CommunityRoom {
	slug: string;
	name: string;
	/** Icon key resolved in the UI. */
	icon: 'chat' | 'english' | 'korean' | 'ielts' | 'topik' | 'grammar' | 'partners' | 'business';
	onlineCount?: number;
	unreadCount?: number;
}

export interface TrendingDiscussion {
	id: string;
	title: string;
	authorName: string;
	authorAvatar: string;
	room: string;
	reactions: number;
	replies: number;
	views: number;
	lastActivityLabel: string;
}

export interface ActivityFeedItemData {
	id: string;
	type: CommunityActivityType;
	userName: string;
	userAvatar: string;
	actionLabel: string;
	title: string;
	excerpt?: string;
	room: string;
	timeLabel: string;
	likes: number;
	replies: number;
	/** Links to /community/posts/[slug] */
	postId?: string;
	tabTags: ActivityFeedTab[];
}

export interface CommunityEventItem {
	id: string;
	title: string;
	datetimeLabel: string;
	/** When omitted, Join stays disabled (no fake registration). */
	href?: string;
}

export interface CommunityContributor {
	rank: number;
	name: string;
	avatar: string;
	points: number;
	badge: string;
}

export interface CommunityOnlineMember {
	id: string;
	name: string;
	avatar: string;
}
