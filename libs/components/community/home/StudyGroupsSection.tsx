import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import StudyGroupCard from '../groups/StudyGroupCard';
import { CommunityStudyGroup } from '../../../types/community/group';

interface StudyGroupsSectionProps {
	groups: CommunityStudyGroup[];
	onJoin: (group: CommunityStudyGroup) => void;
	onCreateGroup?: () => void;
}

const StudyGroupsSection = ({ groups, onJoin, onCreateGroup }: StudyGroupsSectionProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'study-groups-section'} aria-labelledby="study-groups-title">
			<div className={'section-heading row'}>
				<div>
					<h2 id="study-groups-title">{t('Study Groups')}</h2>
					<p>{t('Find a cohort that matches your goals.')}</p>
				</div>
				<div className={'section-heading-actions'}>
					{onCreateGroup ? (
						<button type="button" className={'create-group-btn'} onClick={onCreateGroup}>
							{t('Create Group')}
						</button>
					) : null}
					<Link href="/community/groups" className={'section-link'}>
						{t('View All Groups')}
					</Link>
				</div>
			</div>
			<div className={'study-groups-grid rich'}>
				{groups.slice(0, 4).map((group) => (
					<StudyGroupCard key={group.slug} group={group} onJoin={onJoin} />
				))}
			</div>
		</section>
	);
};

export default StudyGroupsSection;
