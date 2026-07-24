import { GetServerSideProps } from 'next';

/** Legacy `/cs/contact` → Contact Support. */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const q = ctx.query;
	const params = new URLSearchParams();
	Object.entries(q).forEach(([key, value]) => {
		if (typeof value === 'string') params.set(key, value);
		else if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry));
	});
	const search = params.toString();
	return {
		redirect: {
			destination: search ? `/support/contact?${search}` : '/support/contact',
			permanent: false,
		},
	};
};

export default function CsContactRedirect() {
	return null;
}
