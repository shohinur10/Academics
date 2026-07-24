import { GetServerSideProps } from 'next';

/** Legacy `/cs/requests/[id]` → Support request detail. */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const id = typeof ctx.params?.id === 'string' ? ctx.params.id : '';
	return {
		redirect: {
			destination: id ? `/support/requests/${id}` : '/support/requests',
			permanent: false,
		},
	};
};

export default function CsRequestDetailRedirect() {
	return null;
}
