import React, { useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import HelpHero from '../../libs/components/cs/help/HelpHero';
import HelpTopics from '../../libs/components/cs/help/HelpTopics';
import HelpFeaturedFaqs from '../../libs/components/cs/help/HelpFeaturedFaqs';
import HelpAnnouncements from '../../libs/components/cs/help/HelpAnnouncements';
import HelpSystemStatus from '../../libs/components/cs/help/HelpSystemStatus';
import HelpContactOptions from '../../libs/components/cs/help/HelpContactOptions';
import {
	FEATURED_FAQS,
	HELP_CONTACT_OPTIONS,
	HELP_TOPICS,
	SYSTEM_STATUS,
} from '../../libs/mock/supportHelpCenter.mock';
import { featuredNoticesForHelpCenter } from '../../libs/mock/supportNotices.mock';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** ACADEMICS Help Center — central Support hub. */
const HelpCenterPage: NextPage = () => {
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<div className={'help-center-page'}>
			<div className={'help-center-container'}>
				<HelpHero initialQuery={searchQuery} onSearch={setSearchQuery} />
			</div>

			<div className={'help-band lavender'}>
				<div className={'help-center-container'}>
					<HelpTopics topics={HELP_TOPICS} />
				</div>
			</div>

			<div className={'help-center-container'}>
				<HelpFeaturedFaqs items={FEATURED_FAQS} />
			</div>

			<div className={'help-band lavender'}>
				<div className={'help-center-container'}>
					<HelpAnnouncements items={featuredNoticesForHelpCenter()} />
				</div>
			</div>

			<div className={'help-center-container'}>
				<HelpSystemStatus items={SYSTEM_STATUS} />
				<HelpContactOptions options={HELP_CONTACT_OPTIONS} />
			</div>
		</div>
	);
};

export default withLayoutCourse(HelpCenterPage, { title: 'Help Center — Academics' });
