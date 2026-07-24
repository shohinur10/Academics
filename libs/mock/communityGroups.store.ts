import { makeVar } from '@apollo/client';
import {
	CommunityStudyGroup,
	StudyGroupAnnouncement,
	StudyGroupCreateForm,
	StudyGroupDetails,
	StudyGroupFilters,
	StudyGroupMember,
	StudyGroupMembershipState,
	StudyGroupResource,
	sizeBucketForCount,
	slugifyGroupName,
} from '../types/community/group';
import {
	COMMUNITY_STUDY_GROUP_DETAILS,
	getSeedStudyGroupBySlug,
} from './communityGroups.mock';

const GROUPS_KEY = 'academics:community:createdStudyGroups';
const MEMBERSHIP_KEY = 'academics:community:studyGroupMembership';
const DELETED_KEY = 'academics:community:deletedStudyGroups';

type MembershipMap = Record<string, StudyGroupMembershipState>;

export type StudyGroupActionResult =
	| { ok: true; group?: StudyGroupDetails; state?: StudyGroupMembershipState; localOnly: true }
	| { ok: false; error: string };

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

const readCreatedGroups = (): StudyGroupDetails[] => readJson(GROUPS_KEY, []);
const writeCreatedGroups = (groups: StudyGroupDetails[]) => writeJson(GROUPS_KEY, groups);

const readMembership = (): MembershipMap => readJson(MEMBERSHIP_KEY, {});
const writeMembership = (map: MembershipMap) => {
	writeJson(MEMBERSHIP_KEY, map);
	studyGroupMembershipVar({ ...map });
};

/** Reactive membership map for UI. */
export const studyGroupMembershipVar = makeVar<MembershipMap>({});

/** Bump to refresh list/detail after create/edit/delete. */
export const studyGroupsRevisionVar = makeVar(0);

export const hydrateStudyGroupMembership = () => {
	studyGroupMembershipVar(readMembership());
};

const readDeleted = (): string[] => readJson<string[]>(DELETED_KEY, []);

export const listStudyGroups = (): CommunityStudyGroup[] => {
	const created = readCreatedGroups();
	const deleted = new Set(readDeleted());
	const seed = COMMUNITY_STUDY_GROUP_DETAILS.filter((g) => !deleted.has(g.slug));
	const bySlug = new Map<string, CommunityStudyGroup>();
	// Created overrides seed for the same slug (session edits).
	[...seed, ...created].forEach((g) => {
		if (deleted.has(g.slug)) return;
		bySlug.set(g.slug, g);
	});
	return Array.from(bySlug.values());
};

export const getStudyGroupBySlug = (slug: string): StudyGroupDetails | null => {
	if (readDeleted().includes(slug)) return null;
	const created = readCreatedGroups().find((g) => g.slug === slug);
	if (created) return created;
	return getSeedStudyGroupBySlug(slug);
};

export const getMembershipState = (
	slug: string,
	userId?: string | null,
): StudyGroupMembershipState => {
	if (!userId) return 'none';
	const map = readMembership();
	return map[slug] ?? 'none';
};

export const isGroupMember = (state: StudyGroupMembershipState) =>
	state === 'joined' || state === 'owner' || state === 'moderator';

export const canModerateGroup = (state: StudyGroupMembershipState) =>
	state === 'owner' || state === 'moderator';

/**
 * Membership mutations.
 * TODO(backend): replace with GraphQL joinStudyGroup / leaveStudyGroup / approveMembership.
 * Until then we persist session-local state only — never claim remote success.
 */
export const requestJoinStudyGroup = async (params: {
	slug: string;
	userId: string;
	userName: string;
	userAvatar: string;
}): Promise<StudyGroupActionResult> => {
	await delay(320);
	const group = getStudyGroupBySlug(params.slug);
	if (!group) return { ok: false, error: 'Group not found.' };
	if (!params.userId) return { ok: false, error: 'Sign in to join a study group.' };

	const current = getMembershipState(params.slug, params.userId);
	if (isGroupMember(current) || current === 'pending') {
		return { ok: true, state: current, localOnly: true };
	}

	if (group.memberCount >= group.memberLimit) {
		return { ok: false, error: 'This group has reached its member limit.' };
	}

	const map = readMembership();
	const nextState: StudyGroupMembershipState = group.privacy === 'private' ? 'pending' : 'joined';
	map[params.slug] = nextState;
	writeMembership(map);

	if (nextState === 'joined') {
		patchGroupMembers(params.slug, (members) => {
			if (members.some((m) => m.id === params.userId)) return members;
			return [
				...members,
				{
					id: params.userId,
					name: params.userName,
					avatar: params.userAvatar,
					role: 'member',
					joinedAt: new Date().toISOString(),
					contributionLevel: 'low',
					online: true,
				},
			];
		});
		bumpMemberCount(params.slug, 1);
	} else {
		patchGroupMembers(params.slug, (members) => {
			if (members.some((m) => m.id === params.userId)) return members;
			return [
				...members,
				{
					id: params.userId,
					name: params.userName,
					avatar: params.userAvatar,
					role: 'member',
					joinedAt: new Date().toISOString(),
					contributionLevel: 'low',
					online: true,
					pending: true,
				},
			];
		});
	}

	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, state: nextState, localOnly: true };
};

export const leaveStudyGroup = async (params: {
	slug: string;
	userId: string;
}): Promise<StudyGroupActionResult> => {
	await delay(280);
	const current = getMembershipState(params.slug, params.userId);
	if (current === 'owner') {
		return { ok: false, error: 'Owners cannot leave. Transfer ownership or delete the group.' };
	}
	if (current === 'none') return { ok: true, state: 'none', localOnly: true };

	const map = readMembership();
	delete map[params.slug];
	writeMembership(map);

	const wasMember = current === 'joined' || current === 'moderator';
	patchGroupMembers(params.slug, (members) => members.filter((m) => m.id !== params.userId));
	if (wasMember) bumpMemberCount(params.slug, -1);

	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, state: 'none', localOnly: true };
};

export const approvePendingMember = async (params: {
	slug: string;
	memberId: string;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(250);
	if (!canModerateGroup(params.actorState)) {
		return { ok: false, error: 'Only owners and moderators can approve members.' };
	}
	let approved = false;
	patchGroupMembers(params.slug, (members) =>
		members.map((m) => {
			if (m.id !== params.memberId || !m.pending) return m;
			approved = true;
			return { ...m, pending: false };
		}),
	);
	if (!approved) return { ok: false, error: 'No pending request found.' };

	const map = readMembership();
	if (map[params.slug] === 'pending') {
		map[params.slug] = 'joined';
		writeMembership(map);
	}
	bumpMemberCount(params.slug, 1);
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, localOnly: true };
};

export const removeMember = async (params: {
	slug: string;
	memberId: string;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(250);
	if (!canModerateGroup(params.actorState)) {
		return { ok: false, error: 'Only owners and moderators can remove members.' };
	}
	const group = getStudyGroupBySlug(params.slug);
	const target = group?.members.find((m) => m.id === params.memberId);
	if (!target) return { ok: false, error: 'Member not found.' };
	if (target.role === 'owner') return { ok: false, error: 'Cannot remove the group owner.' };
	if (params.actorState === 'moderator' && target.role === 'moderator') {
		return { ok: false, error: 'Moderators cannot remove other moderators.' };
	}

	patchGroupMembers(params.slug, (members) => members.filter((m) => m.id !== params.memberId));
	if (!target.pending) bumpMemberCount(params.slug, -1);
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, localOnly: true };
};

export const promoteModerator = async (params: {
	slug: string;
	memberId: string;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(250);
	if (params.actorState !== 'owner') {
		return { ok: false, error: 'Only the owner can promote moderators.' };
	}
	patchGroupMembers(params.slug, (members) =>
		members.map((m) =>
			m.id === params.memberId && !m.pending ? { ...m, role: 'moderator' as const } : m,
		),
	);
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, localOnly: true };
};

export const createStudyGroup = async (params: {
	form: StudyGroupCreateForm;
	userId: string;
	userName: string;
	userAvatar: string;
}): Promise<StudyGroupActionResult> => {
	await delay(450);
	if (!params.userId) return { ok: false, error: 'Sign in to create a study group.' };
	const name = params.form.name.trim();
	if (!name) return { ok: false, error: 'Group name is required.' };
	if (!params.form.description.trim()) return { ok: false, error: 'Description is required.' };
	if (params.form.memberLimit < 2) return { ok: false, error: 'Member limit must be at least 2.' };

	let slug = slugifyGroupName(name);
	if (getStudyGroupBySlug(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

	const rules = params.form.rulesText
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);

	const group: StudyGroupDetails = {
		slug,
		name,
		description: params.form.description.trim(),
		about: params.form.description.trim(),
		memberCount: 1,
		onlineCount: 1,
		iconTone: 'blue',
		avatars: [params.userAvatar],
		language: params.form.language,
		level: params.form.level,
		goal: params.form.goal,
		privacy: params.form.privacy,
		memberLimit: params.form.memberLimit,
		tags: params.form.tags,
		activityLevel: 'medium',
		lastActiveAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
		coverImage: params.form.coverImage || undefined,
		chatRoomSlug: `group-${slug}`,
		creator: { id: params.userId, name: params.userName, avatar: params.userAvatar },
		rules: rules.length ? rules : ['Be respectful', 'Stay on topic'],
		members: [
			{
				id: params.userId,
				name: params.userName,
				avatar: params.userAvatar,
				role: 'owner',
				joinedAt: new Date().toISOString(),
				contributionLevel: 'high',
				online: true,
			},
		],
		announcements: [],
		resources: [],
		events: [],
	};

	const created = [group, ...readCreatedGroups()].slice(0, 40);
	writeCreatedGroups(created);

	const map = readMembership();
	map[slug] = 'owner';
	writeMembership(map);
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);

	return { ok: true, group, state: 'owner', localOnly: true };
};

export const updateStudyGroup = async (params: {
	slug: string;
	patch: Partial<Pick<StudyGroupDetails, 'name' | 'description' | 'about' | 'privacy' | 'memberLimit' | 'tags' | 'rules' | 'coverImage'>>;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(300);
	if (!canModerateGroup(params.actorState)) {
		return { ok: false, error: 'Only owners and moderators can edit the group.' };
	}
	const existing = getStudyGroupBySlug(params.slug);
	if (!existing) return { ok: false, error: 'Group not found.' };
	const next = { ...existing, ...params.patch, lastActiveAt: new Date().toISOString() };
	upsertGroup(next);
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, group: next, localOnly: true };
};

export const deleteStudyGroup = async (params: {
	slug: string;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(300);
	if (params.actorState !== 'owner') {
		return { ok: false, error: 'Only the owner can delete the group.' };
	}
	writeCreatedGroups(readCreatedGroups().filter((g) => g.slug !== params.slug));
	const map = readMembership();
	delete map[params.slug];
	writeMembership(map);
	writeJson(DELETED_KEY, Array.from(new Set([...readDeleted(), params.slug])));
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, localOnly: true };
};

export const addAnnouncement = async (params: {
	slug: string;
	title: string;
	body: string;
	authorName: string;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(250);
	if (!canModerateGroup(params.actorState)) {
		return { ok: false, error: 'Only owners and moderators can post announcements.' };
	}
	const group = getStudyGroupBySlug(params.slug);
	if (!group) return { ok: false, error: 'Group not found.' };
	const announcement: StudyGroupAnnouncement = {
		id: `ann-${Date.now()}`,
		title: params.title.trim(),
		body: params.body.trim(),
		authorName: params.authorName,
		createdAt: new Date().toISOString(),
	};
	upsertGroup({
		...group,
		announcements: [announcement, ...group.announcements],
		lastActiveAt: new Date().toISOString(),
	});
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, localOnly: true };
};

export const addGroupResource = async (params: {
	slug: string;
	resource: Omit<StudyGroupResource, 'id' | 'addedAt'>;
	actorState: StudyGroupMembershipState;
}): Promise<StudyGroupActionResult> => {
	await delay(250);
	if (!canModerateGroup(params.actorState)) {
		return { ok: false, error: 'Only owners and moderators can manage resources.' };
	}
	const group = getStudyGroupBySlug(params.slug);
	if (!group) return { ok: false, error: 'Group not found.' };
	const resource: StudyGroupResource = {
		...params.resource,
		id: `res-${Date.now()}`,
		addedAt: new Date().toISOString(),
	};
	upsertGroup({
		...group,
		resources: [resource, ...group.resources],
		lastActiveAt: new Date().toISOString(),
	});
	studyGroupsRevisionVar(studyGroupsRevisionVar() + 1);
	return { ok: true, localOnly: true };
};

export const filterAndSortStudyGroups = (
	groups: CommunityStudyGroup[],
	filters: StudyGroupFilters,
): CommunityStudyGroup[] => {
	const q = filters.query.trim().toLowerCase();
	const recentCutoff = Date.now() - 7 * 86400000;

	let next = groups.filter((g) => {
		if (q) {
			const hay = `${g.name} ${g.description} ${g.tags.join(' ')}`.toLowerCase();
			if (!hay.includes(q)) return false;
		}
		if (filters.language !== 'all' && g.language !== filters.language) return false;
		if (filters.goal !== 'all' && g.goal !== filters.goal) return false;
		if (filters.level !== 'all' && g.level !== filters.level) return false;
		if (filters.privacy !== 'all' && g.privacy !== filters.privacy) return false;
		if (filters.size !== 'all' && sizeBucketForCount(g.memberCount) !== filters.size) return false;
		if (filters.activeRecently && new Date(g.lastActiveAt).getTime() < recentCutoff) return false;
		return true;
	});

	next = [...next].sort((a, b) => {
		switch (filters.sort) {
			case 'name':
				return a.name.localeCompare(b.name);
			case 'newest':
				return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
			case 'activity': {
				const rank = { high: 3, medium: 2, low: 1 };
				return rank[b.activityLevel] - rank[a.activityLevel];
			}
			case 'members':
			default:
				return b.memberCount - a.memberCount;
		}
	});

	return next;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const upsertGroup = (group: StudyGroupDetails) => {
	const created = readCreatedGroups().filter((g) => g.slug !== group.slug);
	// Always mirror edits into created store so seed patches persist this session.
	writeCreatedGroups([group, ...created].slice(0, 40));
};

const patchGroupMembers = (slug: string, updater: (members: StudyGroupMember[]) => StudyGroupMember[]) => {
	const group = getStudyGroupBySlug(slug);
	if (!group) return;
	upsertGroup({ ...group, members: updater(group.members) });
};

const bumpMemberCount = (slug: string, delta: number) => {
	const group = getStudyGroupBySlug(slug);
	if (!group) return;
	upsertGroup({ ...group, memberCount: Math.max(0, group.memberCount + delta) });
};
