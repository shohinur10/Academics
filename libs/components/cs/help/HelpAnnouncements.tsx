import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { NoticeArticle } from '../../../types/support/notice';
import NoticeCard from '../../support/notices/NoticeCard';

interface HelpAnnouncementsProps {
	items: NoticeArticle[];
}

const HelpAnnouncements = ({ items }: HelpAnnouncementsProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'help-section help-announcements'} aria-labelledby="help-announcements-title">
			<div className={'section-heading row'}>
				<div>
					<h2 id="help-announcements-title">{t('Latest announcements')}</h2>
					<p>{t('Stay up to date with platform changes and maintenance.')}</p>
				</div>
				<Link href="/support/notices" className={'section-link'}>
					{t('View all notices')}
				</Link>
			</div>
			<ul className={'announce-grid'}>
				{items.map((item) => (
					<li key={item.id}>
						<NoticeCard notice={item} />
					</li>
				))}
			</ul>
		</section>
	);
};

export default HelpAnnouncements;
