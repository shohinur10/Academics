import { GetServerSideProps } from 'next';

/** Legacy `/cs/notice/[slug]` → Notice Center article. */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const slug = typeof ctx.params?.slug === 'string' ? ctx.params.slug : '';
	return {
		redirect: {
			destination: slug ? `/support/notices/${slug}` : '/support/notices',
			permanent: false,
		},
	};
};

export default function CsNoticeSlugRedirect() {
	return null;
}
