import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Drawer, IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import CommunitySidebar from '../../libs/components/community/home/CommunitySidebar';
import CommunityHero from '../../libs/components/community/home/CommunityHero';
import TrendingDiscussions from '../../libs/components/community/home/TrendingDiscussions';
import ActivityFeed from '../../libs/components/community/home/ActivityFeed';
import CommunityRightSidebar from '../../libs/components/community/home/CommunityRightSidebar';
import StudyGroupsSection from '../../libs/components/community/home/StudyGroupsSection';
import { openCreateContentModal } from '../../libs/components/community/create/createContentModalState';
import { openCreateStudyGroupModal } from '../../libs/components/community/groups/createStudyGroupModalState';
import { userVar } from '../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import {
	COMMUNITY_CONTRIBUTORS,
	COMMUNITY_EVENTS,
	COMMUNITY_ONLINE_MEMBERS,
	COMMUNITY_ROOMS,
	COMMUNITY_STATS,
	COMMUNITY_STUDY_GROUPS,
	TRENDING_DISCUSSIONS,
	getActivityFeedByTab,
} from '../../libs/mock/community.mock';
import { requestJoinStudyGroup } from '../../libs/mock/communityGroups.store';
import { REACT_APP_API_URL } from '../../libs/config';
import {
	ActivityFeedTab,
	CommunityCreateAction,
	CommunityNavId,
	CommunityStudyGroup,
	mapCreateActionToType,
} from '../../libs/types/community/community';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const CommunityHome: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [activeNav, setActiveNav] = useState<CommunityNavId>('home');
	const [feedTab, setFeedTab] = useState<ActivityFeedTab>('all');
	const [roomsDrawerOpen, setRoomsDrawerOpen] = useState(false);

	const feedItems = useMemo(() => getActivityFeedByTab(feedTab), [feedTab]);
	const displayName = user?.memberNick || t('Learner');

	useEffect(() => {
		if (!router.isReady) return;
		const createQuery = typeof router.query.create === 'string' ? router.query.create : undefined;
		const hashCreate = router.asPath.includes('#create');
		if (createQuery || hashCreate) {
			openCreateContentModal(mapCreateActionToType(createQuery as CommunityCreateAction));
			if (createQuery) {
				const { create: _omit, ...rest } = router.query;
				void router.replace({ pathname: '/community', query: rest }, undefined, { shallow: true });
			}
		}
	}, [router.isReady, router.query.create, router.asPath]);

	const createHandler = (action: CommunityCreateAction, draft?: string) => {
		openCreateContentModal(action, draft);
	};

	const navHandler = async (id: CommunityNavId) => {
		setActiveNav(id);
		setRoomsDrawerOpen(false);
		if (id === 'home') return;
		await sweetTopSuccessAlert(t('This section will be available soon.'));
	};

	const createGroupHandler = async () => {
		setRoomsDrawerOpen(false);
		if (!user?._id) {
			await sweetMixinErrorAlert(t('Sign in to create a study group.'));
			return;
		}
		openCreateStudyGroupModal();
	};

	const joinGroupHandler = async (group: CommunityStudyGroup) => {
		if (!user?._id) {
			await sweetMixinErrorAlert(t('Sign in to join a study group.'));
			return;
		}
		const avatar = user.memberImage
			? user.memberImage.startsWith('/') || user.memberImage.startsWith('http')
				? user.memberImage
				: `${REACT_APP_API_URL}/${user.memberImage}`
			: '/img/profile/defaultUser.svg';
		const result = await requestJoinStudyGroup({
			slug: group.slug,
			userId: user._id,
			userName: user.memberNick || 'You',
			userAvatar: avatar,
		});
		if (!result.ok) {
			await sweetMixinErrorAlert(t(result.error));
			return;
		}
		if (result.state === 'pending') {
			await sweetTopSuccessAlert(t('Join request submitted. Awaiting approval.'));
			return;
		}
		await sweetTopSuccessAlert(t('You joined this group.'));
		await router.push(`/community/groups/${group.slug}`);
	};

	const seeAllOnlineHandler = async () => {
		await sweetTopSuccessAlert(t('Full online member list will be available soon.'));
	};

	return (
		<div className={'community-home-page'}>
			<div className={'community-home-container'}>
				<div className={'community-mobile-bar'}>
					<button
						type="button"
						className={'mobile-rooms-btn'}
						aria-label={t('Open rooms menu')}
						onClick={() => setRoomsDrawerOpen(true)}
					>
						<MenuOutlinedIcon />
						{t('Rooms & Groups')}
					</button>
				</div>

				<div className={'community-home-layout'}>
					<div className={'community-left-col'}>
						<CommunitySidebar
							activeNav={activeNav}
							onNavSelect={navHandler}
							rooms={COMMUNITY_ROOMS}
							groups={COMMUNITY_STUDY_GROUPS}
							onCreateGroup={createGroupHandler}
						/>
					</div>

					<main className={'community-main-col'}>
						<CommunityHero userName={displayName} stats={COMMUNITY_STATS} onCreate={createHandler} />
						<TrendingDiscussions items={TRENDING_DISCUSSIONS} />
						<ActivityFeed items={feedItems} activeTab={feedTab} onTabChange={setFeedTab} />
					</main>

					<div className={'community-right-col'}>
						<CommunityRightSidebar
							onlineMembers={COMMUNITY_ONLINE_MEMBERS}
							onlineCount={COMMUNITY_ONLINE_MEMBERS.length + 42}
							events={COMMUNITY_EVENTS}
							contributors={COMMUNITY_CONTRIBUTORS}
							onSeeAllOnline={seeAllOnlineHandler}
						/>
					</div>
				</div>

				<StudyGroupsSection
					groups={COMMUNITY_STUDY_GROUPS}
					onJoin={joinGroupHandler}
					onCreateGroup={createGroupHandler}
				/>
			</div>

			<Drawer
				anchor="left"
				open={roomsDrawerOpen}
				onClose={() => setRoomsDrawerOpen(false)}
				className={'community-rooms-drawer'}
			>
				<div className={'rooms-drawer-head'}>
					<span>{t('Rooms & Groups')}</span>
					<IconButton aria-label={t('Close rooms menu')} onClick={() => setRoomsDrawerOpen(false)}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				<CommunitySidebar
					activeNav={activeNav}
					onNavSelect={navHandler}
					rooms={COMMUNITY_ROOMS}
					groups={COMMUNITY_STUDY_GROUPS}
					onCreateGroup={createGroupHandler}
				/>
			</Drawer>
		</div>
	);
};

export default withLayoutCourse(CommunityHome, { title: 'Community — Academics' });
