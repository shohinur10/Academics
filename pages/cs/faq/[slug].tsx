import { GetServerSideProps } from 'next';

/** Legacy `/cs/faq/[slug]` → canonical FAQ article. */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const slug = typeof ctx.params?.slug === 'string' ? ctx.params.slug : '';
	return {
		redirect: {
			destination: slug ? `/support/faq/${slug}` : '/support/faq',
			permanent: false,
		},
	};
};

export default function CsFaqSlugRedirect() {
	return null;
}
