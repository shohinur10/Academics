import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import StudyGroupCard from '../../../libs/components/community/groups/StudyGroupCard';
import StudyGroupsToolbar from '../../../libs/components/community/groups/StudyGroupsToolbar';
import { openCreateStudyGroupModal } from '../../../libs/components/community/groups/createStudyGroupModalState';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../../libs/config';
import {
	emptyStudyGroupFilters,
	StudyGroupFilters,
	CommunityStudyGroup,
} from '../../../libs/types/community/group';
import {
	filterAndSortStudyGroups,
	getMembershipState,
	hydrateStudyGroupMembership,
	listStudyGroups,
	requestJoinStudyGroup,
	studyGroupMembershipVar,
	studyGroupsRevisionVar,
} from '../../../libs/mock/communityGroups.store';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';

const PAGE_SIZE = 6;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const resolveAvatar = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const CommunityGroupsPage: NextPage = () => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const membershipMap = useReactiveVar(studyGroupMembershipVar);
	const revision = useReactiveVar(studyGroupsRevisionVar);

	const [filters, setFilters] = useState<StudyGroupFilters>(emptyStudyGroupFilters());
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [joiningSlug, setJoiningSlug] = useState<string | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		hydrateStudyGroupMembership();
		setReady(true);
	}, []);

	const groups = useMemo(() => {
		void revision;
		if (!ready) return [];
		return listStudyGroups();
	}, [ready, revision]);

	const filtered = useMemo(() => filterAndSortStudyGroups(groups, filters), [groups, filters]);

	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [filters]);

	const visible = filtered.slice(0, visibleCount);
	const hasMore = visibleCount < filtered.length;

	const joinHandler = async (group: CommunityStudyGroup) => {
		if (!user?._id) {
			await sweetMixinErrorAlert(t('Sign in to join a study group.'));
			return;
		}
		setJoiningSlug(group.slug);
		try {
			const result = await requestJoinStudyGroup({
				slug: group.slug,
				userId: user._id,
				userName: user.memberNick || 'You',
				userAvatar: resolveAvatar(user.memberImage),
			});
			if (!result.ok) {
				await sweetMixinErrorAlert(t(result.error));
				return;
			}
			if (result.state === 'pending') {
				await sweetTopSuccessAlert(t('Join request submitted. Awaiting approval.'));
			} else if (result.state === 'joined') {
				await sweetTopSuccessAlert(t('You joined this group.'));
			}
		} finally {
			setJoiningSlug(null);
		}
	};

	const createHandler = async () => {
		if (!user?._id) {
			await sweetMixinErrorAlert(t('Sign in to create a study group.'));
			return;
		}
		openCreateStudyGroupModal();
	};

	return (
		<div className={'study-groups-page'}>
			<div className={'study-groups-container'}>
				<StudyGroupsToolbar
					filters={filters}
					resultCount={filtered.length}
					onChange={setFilters}
					onCreate={() => void createHandler()}
				/>

				<nav className={'groups-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/community">{t('Community')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t('Study Groups')}</span>
				</nav>

				{filtered.length === 0 ? (
					<p className={'empty-note'}>{t('No groups match your filters.')}</p>
				) : (
					<div className={'study-groups-grid rich'}>
						{visible.map((group) => (
							<StudyGroupCard
								key={group.slug}
								group={group}
								membership={getMembershipState(group.slug, user?._id) || membershipMap[group.slug] || 'none'}
								joining={joiningSlug === group.slug}
								onJoin={joinHandler}
							/>
						))}
					</div>
				)}

				{hasMore ? (
					<div className={'load-more-wrap'}>
						<button type="button" className={'load-more-btn'} onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
							{t('Load more')}
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default withLayoutCourse(CommunityGroupsPage, { title: 'Study Groups — Academics' });
