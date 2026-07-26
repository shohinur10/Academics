import { useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: { locale?: string }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/**
 * Legacy join route — redirects to the redesigned Login page.
 * Signup lives at /account/register.
 */
const JoinRedirect: NextPage = () => {
	const router = useRouter();
	const redirected = useRef(false);
	const referrer = typeof router.query.referrer === 'string' ? router.query.referrer : undefined;

	useEffect(() => {
		if (!router.isReady || redirected.current) return;
		redirected.current = true;
		void router.replace({
			pathname: '/account/login',
			query: referrer ? { referrer } : undefined,
		});
	}, [router, referrer]);

	return (
		<main className="auth-register-page" aria-busy="true">
			<p className="auth-switch" style={{ padding: '48px 24px', textAlign: 'center' }}>
				Redirecting to login…
			</p>
		</main>
	);
};

export default JoinRedirect;
