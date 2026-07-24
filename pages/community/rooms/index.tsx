import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import { COMMUNITY_ROOMS } from '../../../libs/mock/community.mock';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const CommunityRoomsPage: NextPage = () => {
	const { t } = useTranslation('common');

	return (
		<div className={'community-stub-page'}>
			<div className={'community-stub-card wide'}>
				<p className={'stub-eyebrow'}>{t('Topic Rooms')}</p>
				<h1>{t('All Rooms')}</h1>
				<ul className={'stub-link-list'}>
					{COMMUNITY_ROOMS.map((room) => (
						<li key={room.slug}>
							<Link href={`/community/rooms/${room.slug}`}>{t(room.name)}</Link>
						</li>
					))}
				</ul>
				<Link href="/community" className={'stub-btn'}>
					{t('Back to Community')}
				</Link>
			</div>
		</div>
	);
};

export default withLayoutCourse(CommunityRoomsPage, { title: 'Rooms — Academics' });
