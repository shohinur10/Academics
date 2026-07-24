import { useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** Legacy query route → /community/rooms/[slug] */
const CommunityRoomRedirect: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) return;
		const slug = typeof router.query.slug === 'string' ? router.query.slug : 'general-chat';
		router.replace(`/community/rooms/${slug}`);
	}, [router.isReady, router.query.slug, router]);

	return null;
};

export default withLayoutCourse(CommunityRoomRedirect, { title: 'Chat Room — Academics' });
