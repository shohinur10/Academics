import {
	ActivityFeedItemData,
	CommunityContributor,
	CommunityEventItem,
	CommunityOnlineMember,
	CommunityRoom,
	CommunityStats,
	TrendingDiscussion,
} from '../types/community/community';
import { COMMUNITY_STUDY_GROUPS } from './communityGroups.mock';

export { COMMUNITY_STUDY_GROUPS };

const AVATARS = [
	'/img/profile/defaultUser.svg',
	'/img/profile/agent.png',
	'/img/profile/girl.svg',
];

export const COMMUNITY_STATS: CommunityStats = {
	members: 18642,
	discussions: 4281,
	answers: 12309,
	studyGroups: 847,
};

export const COMMUNITY_ROOMS: CommunityRoom[] = [
	{ slug: 'general-chat', name: 'General Chat', icon: 'chat', onlineCount: 214, unreadCount: 3 },
	{ slug: 'english-practice', name: 'English Practice', icon: 'english', onlineCount: 120, unreadCount: 12 },
	{ slug: 'korean-practice', name: 'Korean Practice', icon: 'korean', onlineCount: 86 },
	{ slug: 'ielts-preparation', name: 'IELTS Preparation', icon: 'ielts', onlineCount: 94, unreadCount: 5 },
	{ slug: 'topik-preparation', name: 'TOPIK Preparation', icon: 'topik', onlineCount: 61 },
	{ slug: 'grammar-help', name: 'Grammar Help', icon: 'grammar', onlineCount: 48 },
	{ slug: 'study-partners', name: 'Study Partners', icon: 'partners', onlineCount: 37, unreadCount: 1 },
	{ slug: 'business-english', name: 'Business English', icon: 'business', onlineCount: 29 },
];

export const TRENDING_DISCUSSIONS: TrendingDiscussion[] = [
	{
		id: 'disc-ielts-jump',
		title: 'How I improved my IELTS score from 6.0 to 7.5',
		authorName: 'Mina Park',
		authorAvatar: AVATARS[2],
		room: 'IELTS Preparation',
		reactions: 186,
		replies: 42,
		views: 3204,
		lastActivityLabel: '2h ago',
	},
	{
		id: 'disc-vocab',
		title: 'Best ways to memorize vocabulary',
		authorName: 'James Lee',
		authorAvatar: AVATARS[1],
		room: 'English Practice',
		reactions: 142,
		replies: 35,
		views: 2108,
		lastActivityLabel: '4h ago',
	},
	{
		id: 'disc-topik-4',
		title: 'TOPIK Level 4 study tips',
		authorName: 'Sora Kim',
		authorAvatar: AVATARS[0],
		room: 'TOPIK Preparation',
		reactions: 98,
		replies: 27,
		views: 1540,
		lastActivityLabel: '6h ago',
	},
	{
		id: 'disc-speaking',
		title: 'Daily speaking challenge',
		authorName: 'Alex Rivera',
		authorAvatar: AVATARS[1],
		room: 'Study Partners',
		reactions: 211,
		replies: 64,
		views: 4012,
		lastActivityLabel: '1h ago',
	},
];

export const ACTIVITY_FEED: ActivityFeedItemData[] = [
	{
		id: 'act-1',
		type: 'question',
		userName: 'Hana Choi',
		userAvatar: AVATARS[2],
		actionLabel: 'posted a question',
		title: 'How do you stay consistent with daily speaking practice?',
		excerpt: 'I keep missing days after work. Looking for a realistic routine…',
		room: 'Daily Speaking',
		timeLabel: '12 min ago',
		likes: 24,
		replies: 8,
		postId: 'disc-speaking',
		tabTags: ['all', 'following', 'popular'],
	},
	{
		id: 'act-2',
		type: 'resource',
		userName: 'David Nguyen',
		userAvatar: AVATARS[1],
		actionLabel: 'shared a resource',
		title: 'Free IELTS Writing Task 2 checklist (PDF)',
		excerpt: 'A one-page checklist I use before submitting practice essays.',
		room: 'IELTS Preparation',
		timeLabel: '38 min ago',
		likes: 67,
		replies: 14,
		postId: 'post-resource-checklist',
		tabTags: ['all', 'popular'],
	},
	{
		id: 'act-3',
		type: 'answer',
		userName: 'Yuna Sato',
		userAvatar: AVATARS[0],
		actionLabel: 'answered a discussion',
		title: 'Best ways to memorize vocabulary',
		excerpt: 'Spaced repetition + example sentences beat word lists alone.',
		room: 'English Practice',
		timeLabel: '1h ago',
		likes: 41,
		replies: 3,
		postId: 'disc-vocab',
		tabTags: ['all', 'following'],
	},
	{
		id: 'act-4',
		type: 'joined_group',
		userName: 'Omar Hassan',
		userAvatar: AVATARS[1],
		actionLabel: 'joined a study group',
		title: 'IELTS Band 7+',
		room: 'Study Groups',
		timeLabel: '2h ago',
		likes: 9,
		replies: 0,
		tabTags: ['all', 'following'],
	},
	{
		id: 'act-5',
		type: 'challenge',
		userName: 'Elena Petrova',
		userAvatar: AVATARS[2],
		actionLabel: 'completed a challenge',
		title: '7-day pronunciation streak',
		excerpt: 'Finished the shadowing challenge — clarity improved a lot.',
		room: 'Pronunciation Hub',
		timeLabel: '3h ago',
		likes: 55,
		replies: 11,
		tabTags: ['all', 'popular'],
	},
	{
		id: 'act-6',
		type: 'success',
		userName: 'Kenji Mori',
		userAvatar: AVATARS[0],
		actionLabel: 'shared a success story',
		title: 'Passed TOPIK Level 4 on the first try',
		excerpt: 'Sharing the weekly plan that finally worked for me.',
		room: 'TOPIK Preparation',
		timeLabel: '5h ago',
		likes: 132,
		replies: 29,
		postId: 'disc-topik-4',
		tabTags: ['all', 'following', 'popular'],
	},
];

export const COMMUNITY_ONLINE_MEMBERS: CommunityOnlineMember[] = [
	{ id: 'u1', name: 'Mina Park', avatar: AVATARS[2] },
	{ id: 'u2', name: 'James Lee', avatar: AVATARS[1] },
	{ id: 'u3', name: 'Sora Kim', avatar: AVATARS[0] },
	{ id: 'u4', name: 'Alex Rivera', avatar: AVATARS[1] },
	{ id: 'u5', name: 'Hana Choi', avatar: AVATARS[2] },
	{ id: 'u6', name: 'David Nguyen', avatar: AVATARS[0] },
	{ id: 'u7', name: 'Yuna Sato', avatar: AVATARS[2] },
	{ id: 'u8', name: 'Omar Hassan', avatar: AVATARS[1] },
];

export const COMMUNITY_EVENTS: CommunityEventItem[] = [
	{
		id: 'evt-speaking',
		title: 'Speaking Club Live',
		datetimeLabel: 'Today · 7:00 PM KST',
	},
	{
		id: 'evt-ielts',
		title: 'IELTS Writing Webinar',
		datetimeLabel: 'Sat · 4:00 PM KST',
	},
	{
		id: 'evt-topik',
		title: 'TOPIK Q&A Session',
		datetimeLabel: 'Sun · 2:00 PM KST',
	},
];

export const COMMUNITY_CONTRIBUTORS: CommunityContributor[] = [
	{ rank: 1, name: 'Mina Park', avatar: AVATARS[2], points: 4820, badge: 'Mentor' },
	{ rank: 2, name: 'James Lee', avatar: AVATARS[1], points: 3910, badge: 'Helper' },
	{ rank: 3, name: 'Sora Kim', avatar: AVATARS[0], points: 3544, badge: 'Guide' },
	{ rank: 4, name: 'Alex Rivera', avatar: AVATARS[1], points: 2980, badge: 'Rising' },
	{ rank: 5, name: 'Hana Choi', avatar: AVATARS[2], points: 2712, badge: 'Rising' },
];

export const getActivityFeedByTab = (tab: 'all' | 'following' | 'popular') =>
	ACTIVITY_FEED.filter((item) => item.tabTags.includes(tab));
