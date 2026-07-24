import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
	CommunityContributor,
	CommunityEventItem,
	CommunityOnlineMember,
} from '../../../types/community/community';

interface CommunityRightSidebarProps {
	onlineMembers: CommunityOnlineMember[];
	onlineCount: number;
	events: CommunityEventItem[];
	contributors: CommunityContributor[];
	onSeeAllOnline: () => void;
}

const CommunityRightSidebar = ({
	onlineMembers,
	onlineCount,
	events,
	contributors,
	onSeeAllOnline,
}: CommunityRightSidebarProps) => {
	const { t } = useTranslation('common');

	return (
		<aside className={'community-right-sidebar'} aria-label={t('Community insights')}>
			<section className={'right-card'} aria-labelledby="online-now-title">
				<div className={'right-card-head'}>
					<h2 id="online-now-title">{t('Online Now')}</h2>
					<button type="button" className={'text-link-btn'} onClick={onSeeAllOnline}>
						{t('See All')}
					</button>
				</div>
				<p className={'online-count'}>
					<strong>{onlineCount}</strong> {t('members online')}
				</p>
				<ul className={'online-avatar-row'}>
					{onlineMembers.slice(0, 8).map((member) => (
						<li key={member.id}>
							<img src={member.avatar} alt={member.name} loading="lazy" title={member.name} />
						</li>
					))}
				</ul>
			</section>

			<section className={'right-card'} aria-labelledby="upcoming-events-title">
				<h2 id="upcoming-events-title">{t('Upcoming Events')}</h2>
				<ul className={'event-list'}>
					{events.map((event) => (
						<li key={event.id} className={'event-item'}>
							<div>
								<strong>{t(event.title)}</strong>
								<span>{event.datetimeLabel}</span>
							</div>
							{event.href ? (
								<Link href={event.href} className={'event-join-btn'}>
									{t('Join')}
								</Link>
							) : (
								<button type="button" className={'event-join-btn'} disabled aria-disabled="true">
									{t('Coming soon')}
								</button>
							)}
						</li>
					))}
				</ul>
			</section>

			<section className={'right-card'} aria-labelledby="top-contributors-title">
				<h2 id="top-contributors-title">{t('Top Contributors')}</h2>
				<ol className={'contributor-list'}>
					{contributors.map((person) => (
						<li key={person.rank}>
							<span className={'rank'}>{person.rank}</span>
							<img src={person.avatar} alt={`${person.name} avatar`} loading="lazy" />
							<div className={'contributor-meta'}>
								<strong>{person.name}</strong>
								<em>
									{person.points.toLocaleString()} {t('pts')}
								</em>
							</div>
							<span className={'contributor-badge'}>{t(person.badge)}</span>
						</li>
					))}
				</ol>
			</section>
		</aside>
	);
};

export default CommunityRightSidebar;
