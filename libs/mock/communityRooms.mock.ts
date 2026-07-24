import {
	CommunityRoomDetails,
	CommunityRoomMessage,
	CommunityRoomMember,
} from '../types/community/room';
import { COMMUNITY_ROOMS } from './community.mock';
import { getStudyGroupBySlug } from './communityGroups.store';

const AVATARS = [
	'/img/profile/defaultUser.svg',
	'/img/profile/agent.png',
	'/img/profile/girl.svg',
];

const baseMembers: CommunityRoomMember[] = [
	{
		id: 'm-mina',
		name: 'Mina Park',
		avatar: AVATARS[2],
		role: 'INSTRUCTOR',
		verified: true,
		online: true,
	},
	{
		id: 'm-james',
		name: 'James Lee',
		avatar: AVATARS[1],
		role: 'MODERATOR',
		online: true,
	},
	{
		id: 'm-sora',
		name: 'Sora Kim',
		avatar: AVATARS[0],
		role: 'STUDENT',
		online: true,
	},
	{
		id: 'm-alex',
		name: 'Alex Rivera',
		avatar: AVATARS[1],
		role: 'STUDENT',
		online: true,
	},
	{
		id: 'm-hana',
		name: 'Hana Choi',
		avatar: AVATARS[2],
		role: 'INSTRUCTOR',
		verified: true,
		online: false,
	},
	{
		id: 'm-omar',
		name: 'Omar Hassan',
		avatar: AVATARS[0],
		role: 'STUDENT',
		online: true,
	},
];

const ROOM_META: Record<
	string,
	Pick<CommunityRoomDetails, 'description' | 'rules' | 'createdAt' | 'creatorName'>
> = {
	'general-chat': {
		description: 'Open conversation for the whole ACADEMICS community.',
		rules: ['Be respectful', 'No spam or self-promo', 'Keep topics learning-related'],
		createdAt: '2024-03-12',
		creatorName: 'ACADEMICS Team',
	},
	'english-practice': {
		description: 'Practice everyday English with learners and instructors.',
		rules: ['English only in this room', 'Correct gently', 'No homework dumping'],
		createdAt: '2024-04-02',
		creatorName: 'Mina Park',
	},
	'korean-practice': {
		description: 'Hangul practice, daily phrases, and friendly corrections.',
		rules: ['Korean or English OK', 'Share audio clips respectfully', 'Stay on topic'],
		createdAt: '2024-04-18',
		creatorName: 'Sora Kim',
	},
	'ielts-preparation': {
		description: 'Speaking, writing, and strategy tips for IELTS candidates.',
		rules: ['Cite sources for band claims', 'No paid exam leaks', 'Encourage peers'],
		createdAt: '2024-05-01',
		creatorName: 'James Lee',
	},
	'topik-preparation': {
		description: 'TOPIK reading, listening, and writing support.',
		rules: ['Share level (TOPIK II etc.)', 'No answer keys for live tests', 'Be supportive'],
		createdAt: '2024-05-20',
		creatorName: 'Hana Choi',
	},
	'grammar-help': {
		description: 'Ask grammar questions and get clear explanations.',
		rules: ['Show your attempt first', 'One question per message preferred', 'Be patient'],
		createdAt: '2024-06-04',
		creatorName: 'James Lee',
	},
	'study-partners': {
		description: 'Find accountability partners and schedule study sessions.',
		rules: ['State timezone', 'No unsolicited DMs pressure', 'Keep it kind'],
		createdAt: '2024-06-15',
		creatorName: 'Alex Rivera',
	},
	'business-english': {
		description: 'Meetings, email tone, and workplace communication practice.',
		rules: ['Keep examples professional', 'Respect confidentiality', 'Constructive feedback'],
		createdAt: '2024-07-01',
		creatorName: 'Mina Park',
	},
};

const SEED_BY_ROOM: Record<string, Array<Omit<CommunityRoomMessage, 'roomSlug' | 'status'>>> = {
	'general-chat': [
		{
			id: 'msg-g1',
			author: baseMembers[0],
			text: 'Welcome everyone! Introduce yourself and share what you are studying this week.',
			createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
			replyCount: 2,
			reactions: [{ emoji: '🎉', count: 8, reactedByMe: false }],
		},
		{
			id: 'msg-g2',
			author: baseMembers[2],
			text: 'Hi! Focusing on listening practice for 20 minutes a day.',
			createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
			replyCount: 0,
			reactions: [{ emoji: '👍', count: 4, reactedByMe: false }],
		},
		{
			id: 'msg-g3',
			author: baseMembers[3],
			text: 'Same here — anyone want a speaking buddy for evenings KST?',
			createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
			replyCount: 3,
			reactions: [
				{ emoji: '❤️', count: 5, reactedByMe: false },
				{ emoji: '🙏', count: 2, reactedByMe: false },
			],
		},
	],
	'english-practice': [
		{
			id: 'msg-e1',
			author: baseMembers[0],
			text: 'Prompt: Describe your morning routine in 5 sentences. Reply with your draft!',
			createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
			replyCount: 6,
			reactions: [{ emoji: '👍', count: 11, reactedByMe: false }],
		},
		{
			id: 'msg-e2',
			author: baseMembers[5],
			text: 'I wake up at 6, make coffee, review flashcards, then walk to the station.',
			createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
			replyCount: 1,
			reactions: [{ emoji: '😂', count: 1, reactedByMe: false }],
		},
		{
			id: 'msg-e3',
			author: baseMembers[1],
			text: 'Nice clarity, Omar. Try adding one connector like “After that…” for flow.',
			createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
			replyCount: 0,
			reactions: [{ emoji: '🙏', count: 3, reactedByMe: false }],
		},
	],
};

const DEFAULT_SEED = SEED_BY_ROOM['general-chat'];

export const getCommunityRoomDetails = (slug: string): CommunityRoomDetails | null => {
	const room = COMMUNITY_ROOMS.find((item) => item.slug === slug);
	if (room) {
		const meta = ROOM_META[slug] ?? ROOM_META['general-chat'];
		return {
			slug: room.slug,
			name: room.name,
			icon: room.icon,
			description: meta.description,
			rules: meta.rules,
			createdAt: meta.createdAt,
			creatorName: meta.creatorName,
			onlineCount: room.onlineCount ?? baseMembers.filter((m) => m.online).length,
			unreadCount: room.unreadCount,
			moderators: baseMembers.filter((m) => m.role === 'MODERATOR' || m.role === 'ADMIN'),
			members: baseMembers,
			pinnedMessageIds: [],
		};
	}

	/** Study-group chat rooms reuse the same messaging channel (`group-{slug}`). */
	if (slug.startsWith('group-')) {
		const groupSlug = slug.slice('group-'.length);
		const group = getStudyGroupBySlug(groupSlug);
		if (!group) return null;
		return {
			slug,
			name: group.name,
			icon: 'partners',
			description: group.description,
			rules: group.rules,
			createdAt: group.createdAt,
			creatorName: group.creator.name,
			onlineCount: group.onlineCount,
			moderators: baseMembers.filter((m) => m.role === 'MODERATOR' || m.role === 'ADMIN'),
			members: baseMembers,
			pinnedMessageIds: [],
		};
	}

	return null;
};

export const getCommunityRoomSeedMessages = (slug: string): CommunityRoomMessage[] => {
	const seed = SEED_BY_ROOM[slug] ?? DEFAULT_SEED;
	return seed.map((item) => ({
		...item,
		roomSlug: slug,
		status: 'sent' as const,
		parentId: null,
	}));
};

export const COMMUNITY_ROOM_SLUGS = COMMUNITY_ROOMS.map((room) => room.slug);

export { COMMUNITY_ROOMS } from './community.mock';
export { COMMUNITY_STUDY_GROUPS } from './communityGroups.mock';
