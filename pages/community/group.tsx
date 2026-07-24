import React, { useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** Legacy `/community/group?slug=` → `/community/groups/[slug]`. */
const CommunityGroupRedirect: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) return;
		const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
		if (slug) {
			void router.replace(`/community/groups/${slug}`);
			return;
		}
		void router.replace('/community/groups');
	}, [router.isReady, router.query.slug, router]);

	return null;
};

export default withLayoutCourse(CommunityGroupRedirect, { title: 'Study Group — Academics' });
