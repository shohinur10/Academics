import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import AuthSoloShell from '../../libs/components/auth/AuthSoloShell';
import ForgotPasswordForm from '../../libs/components/auth/ForgotPasswordForm';
import AuthRecoveryAside from '../../libs/components/auth/AuthRecoveryAside';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const ForgotPasswordPage: NextPage = () => (
	<AuthSoloShell label="Forgot password" aside={<AuthRecoveryAside />}>
		<ForgotPasswordForm />
	</AuthSoloShell>
);

export default withLayoutCourse(ForgotPasswordPage, { title: 'Forgot Password — Academics' });
