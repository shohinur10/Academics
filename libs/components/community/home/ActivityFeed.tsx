import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ActivityFeedItemData, ActivityFeedTab } from '../../../types/community/community';
import ActivityFeedItem from './ActivityFeedItem';

const TABS: { id: ActivityFeedTab; label: string }[] = [
	{ id: 'all', label: 'All' },
	{ id: 'following', label: 'Following' },
	{ id: 'popular', label: 'Popular' },
];

const MOBILE_PAGE_SIZE = 5;

interface ActivityFeedProps {
	items: ActivityFeedItemData[];
	activeTab: ActivityFeedTab;
	onTabChange: (tab: ActivityFeedTab) => void;
}

const ActivityFeed = ({ items, activeTab, onTabChange }: ActivityFeedProps) => {
	const { t } = useTranslation('common');
	const [visible, setVisible] = useState(MOBILE_PAGE_SIZE);

	useEffect(() => {
		setVisible(MOBILE_PAGE_SIZE);
	}, [activeTab, items]);

	const shown = items.slice(0, visible);
	const hasMore = visible < items.length;

	return (
		<section className={'activity-feed'} aria-labelledby="activity-feed-title">
			<div className={'section-heading'}>
				<h2 id="activity-feed-title">{t('Recent Activity')}</h2>
				<p>{t('Stay up to date with learners and instructors.')}</p>
			</div>

			<div className={'feed-tabs'} role="tablist" aria-label={t('Activity filters')}>
				{TABS.map((tab) => {
					const selected = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							id={`feed-tab-${tab.id}`}
							aria-selected={selected}
							aria-controls="activity-feed-panel"
							tabIndex={selected ? 0 : -1}
							className={selected ? 'active' : ''}
							onClick={() => onTabChange(tab.id)}
						>
							{t(tab.label)}
						</button>
					);
				})}
			</div>

			<div
				id="activity-feed-panel"
				role="tabpanel"
				aria-labelledby={`feed-tab-${activeTab}`}
				className={'feed-list'}
			>
				{shown.length === 0 ? (
					<p className={'feed-empty'}>{t('No activity in this feed yet.')}</p>
				) : (
					shown.map((item) => <ActivityFeedItem key={item.id} item={item} />)
				)}
			</div>

			{hasMore ? (
				<button
					type="button"
					className={'feed-load-more'}
					onClick={() => setVisible((n) => n + MOBILE_PAGE_SIZE)}
				>
					{t('Load more')}
				</button>
			) : null}
		</section>
	);
};

export default ActivityFeed;
