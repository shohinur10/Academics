import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Drawer, IconButton, useMediaQuery } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import GroupDetailHeader from '../../../libs/components/community/groups/GroupDetailHeader';
import GroupChatPanel from '../../../libs/components/community/groups/GroupChatPanel';
import {
	GroupAboutSection,
	GroupAnnouncementsSection,
	GroupEventsSection,
	GroupMembersSection,
	GroupModerationBar,
	GroupResourcesSection,
	GroupRulesSection,
} from '../../../libs/components/community/groups/GroupSections';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../../libs/config';
import { StudyGroupDetailTab, StudyGroupMembershipState } from '../../../libs/types/community/group';
import { COMMUNITY_STUDY_GROUP_SLUGS } from '../../../libs/mock/communityGroups.mock';
import {
	addAnnouncement,
	addGroupResource,
	approvePendingMember,
	canModerateGroup,
	deleteStudyGroup,
	getMembershipState,
	getStudyGroupBySlug,
	hydrateStudyGroupMembership,
	isGroupMember,
	leaveStudyGroup,
	promoteModerator,
	removeMember,
	requestJoinStudyGroup,
	studyGroupMembershipVar,
	studyGroupsRevisionVar,
	updateStudyGroup,
} from '../../../libs/mock/communityGroups.store';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const paths = (locales ?? ['en']).flatMap((locale) =>
		COMMUNITY_STUDY_GROUP_SLUGS.map((slug) => ({ params: { slug }, locale })),
	);
	return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const TABS: { id: StudyGroupDetailTab; label: string }[] = [
	{ id: 'about', label: 'About' },
	{ id: 'chat', label: 'Group chat' },
	{ id: 'announcements', label: 'Announcements' },
	{ id: 'resources', label: 'Resources' },
	{ id: 'events', label: 'Events' },
	{ id: 'members', label: 'Members' },
	{ id: 'rules', label: 'Rules' },
];

const resolveAvatar = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const CommunityGroupDetailPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
	const user = useReactiveVar(userVar);
	const membershipMap = useReactiveVar(studyGroupMembershipVar);
	const revision = useReactiveVar(studyGroupsRevisionVar);
	const isPhone = useMediaQuery('(max-width:767px)');

	const [ready, setReady] = useState(false);
	const [tab, setTab] = useState<StudyGroupDetailTab>('about');
	const [busy, setBusy] = useState(false);
	const [membersOpen, setMembersOpen] = useState(false);
	const [chatFullScreen, setChatFullScreen] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);

	useEffect(() => {
		hydrateStudyGroupMembership();
		setReady(true);
	}, []);

	const group = useMemo(() => {
		void revision;
		if (!ready || !slug) return null;
		return getStudyGroupBySlug(slug);
	}, [ready, slug, revision]);

	const membership: StudyGroupMembershipState = useMemo(() => {
		void membershipMap;
		return getMembershipState(slug, user?._id);
	}, [slug, user?._id, membershipMap, revision]);

	const canChat = isGroupMember(membership);

	const runAction = useCallback(
		async (fn: () => Promise<{ ok: boolean; error?: string }>, successMessage?: string) => {
			setBusy(true);
			setActionError(null);
			try {
				const result = await fn();
				if (!result.ok) {
					setActionError(result.error || t('Something went wrong.'));
					await sweetMixinErrorAlert(t(result.error || 'Something went wrong.'));
					return false;
				}
				if (successMessage) await sweetTopSuccessAlert(t(successMessage));
				return true;
			} finally {
				setBusy(false);
			}
		},
		[t],
	);

	const joinHandler = async () => {
		if (!user?._id) {
			await sweetMixinErrorAlert(t('Sign in to join a study group.'));
			return;
		}
		await runAction(
			() =>
				requestJoinStudyGroup({
					slug,
					userId: user._id,
					userName: user.memberNick || 'You',
					userAvatar: resolveAvatar(user.memberImage),
				}),
			group?.privacy === 'private' ? 'Join request submitted. Awaiting approval.' : 'You joined this group.',
		);
	};

	const leaveHandler = async () => {
		if (!user?._id) return;
		const confirmed = window.confirm(t('Leave this study group?'));
		if (!confirmed) return;
		await runAction(() => leaveStudyGroup({ slug, userId: user._id }), 'You left this group.');
	};

	const deleteHandler = async () => {
		const confirmed = window.confirm(t('Delete this study group? This cannot be undone in this session.'));
		if (!confirmed) return;
		const ok = await runAction(() => deleteStudyGroup({ slug, actorState: membership }));
		if (ok) await router.push('/community/groups');
	};

	const editHandler = async () => {
		if (!group || !canModerateGroup(membership)) return;
		const nextName = window.prompt(t('Group name'), group.name);
		if (nextName === null) return;
		const nextDesc = window.prompt(t('Description'), group.description);
		if (nextDesc === null) return;
		await runAction(
			() =>
				updateStudyGroup({
					slug,
					actorState: membership,
					patch: { name: nextName.trim() || group.name, description: nextDesc.trim() || group.description, about: nextDesc.trim() || group.about },
				}),
			'Group updated.',
		);
	};

	if (!ready) {
		return (
			<div className={'study-group-detail-page'}>
				<p className={'loading-note'}>{t('Loading…')}</p>
			</div>
		);
	}

	if (!group) {
		return (
			<div className={'community-stub-page'}>
				<div className={'community-stub-card'}>
					<h1>{t('Group not found')}</h1>
					<p>{t('This study group does not exist or was removed.')}</p>
					<Link href="/community/groups" className={'stub-btn'}>
						{t('View All Groups')}
					</Link>
				</div>
			</div>
		);
	}

	const membersPanel = (
		<GroupMembersSection
			group={group}
			membership={membership}
			onApprove={async (memberId) => {
				await runAction(() => approvePendingMember({ slug, memberId, actorState: membership }), 'Member approved.');
			}}
			onRemove={async (memberId) => {
				await runAction(() => removeMember({ slug, memberId, actorState: membership }), 'Member removed.');
			}}
			onPromote={async (memberId) => {
				await runAction(() => promoteModerator({ slug, memberId, actorState: membership }), 'Moderator promoted.');
			}}
		/>
	);

	return (
		<div className={'study-group-detail-page'}>
			<div className={'study-group-detail-container'}>
				<nav className={'groups-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/community">{t('Community')}</Link>
					<span aria-hidden="true">/</span>
					<Link href="/community/groups">{t('Study Groups')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t(group.name)}</span>
				</nav>

				<GroupDetailHeader
					group={group}
					membership={membership}
					busy={busy}
					onJoin={() => void joinHandler()}
					onLeave={() => void leaveHandler()}
					onOpenMembers={() => (isPhone ? setMembersOpen(true) : setTab('members'))}
					onOpenChat={isPhone ? () => setChatFullScreen(true) : () => setTab('chat')}
				/>

				<GroupModerationBar membership={membership} onEdit={() => void editHandler()} onDelete={() => void deleteHandler()} />

				{actionError ? (
					<p className={'action-error'} role="alert">
						{actionError}
					</p>
				) : null}

				<div className={'group-tabs'} role="tablist" aria-label={t('Group sections')}>
					{TABS.map((item) => (
						<button
							key={item.id}
							type="button"
							role="tab"
							aria-selected={tab === item.id}
							className={tab === item.id ? 'is-active' : ''}
							onClick={() => setTab(item.id)}
						>
							{t(item.label)}
						</button>
					))}
				</div>

				<div className={'group-tab-panels'} role="tabpanel">
					{tab === 'about' ? <GroupAboutSection group={group} /> : null}
					{tab === 'chat' ? (
						isPhone ? (
							<div className={'group-section'}>
								<p>{t('Open the full-screen chat to message this group.')}</p>
								<button type="button" className={'join-group-btn'} onClick={() => setChatFullScreen(true)}>
									{t('Open chat')}
								</button>
							</div>
						) : (
							<GroupChatPanel chatRoomSlug={group.chatRoomSlug} canChat={canChat} />
						)
					) : null}
					{tab === 'announcements' ? (
						<GroupAnnouncementsSection
							group={group}
							membership={membership}
							onPost={async (title, body) => {
								await runAction(
									() =>
										addAnnouncement({
											slug,
											title,
											body,
											authorName: user?.memberNick || 'Moderator',
											actorState: membership,
										}),
									'Announcement posted.',
								);
							}}
						/>
					) : null}
					{tab === 'resources' ? (
						<GroupResourcesSection
							group={group}
							membership={membership}
							onAdd={async (resource) => {
								await runAction(
									() =>
										addGroupResource({
											slug,
											actorState: membership,
											resource: {
												...resource,
												addedBy: user?.memberNick || 'Moderator',
											},
										}),
									'Resource added.',
								);
							}}
						/>
					) : null}
					{tab === 'events' ? <GroupEventsSection group={group} /> : null}
					{tab === 'members' && !isPhone ? membersPanel : null}
					{tab === 'members' && isPhone ? (
						<div className={'group-section'}>
							<button type="button" className={'join-group-btn'} onClick={() => setMembersOpen(true)}>
								{t('Open members')}
							</button>
						</div>
					) : null}
					{tab === 'rules' ? <GroupRulesSection group={group} /> : null}
				</div>
			</div>

			{chatFullScreen ? (
				<GroupChatPanel
					chatRoomSlug={group.chatRoomSlug}
					canChat={canChat}
					fullScreen
					onCloseFullScreen={() => setChatFullScreen(false)}
				/>
			) : null}

			<Drawer
				anchor="right"
				open={membersOpen}
				onClose={() => setMembersOpen(false)}
				className={'group-members-drawer'}
			>
				<div className={'drawer-head'}>
					<span>{t('Members')}</span>
					<IconButton aria-label={t('Close')} onClick={() => setMembersOpen(false)}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				{membersPanel}
			</Drawer>
		</div>
	);
};

export default withLayoutCourse(CommunityGroupDetailPage, { title: 'Study Group — Academics' });
