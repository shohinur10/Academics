import { GetServerSideProps } from 'next';

/** Legacy `/cs/faq` → canonical FAQ module. */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const q = ctx.query;
	const params = new URLSearchParams();
	Object.entries(q).forEach(([key, value]) => {
		if (key === 'topic' && typeof value === 'string') {
			params.set('category', value);
			return;
		}
		if (typeof value === 'string') params.set(key, value);
		else if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry));
	});
	const search = params.toString();
	return {
		redirect: {
			destination: search ? `/support/faq?${search}` : '/support/faq',
			permanent: false,
		},
	};
};

export default function CsFaqRedirect() {
	return null;
}
