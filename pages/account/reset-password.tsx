import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import AuthSoloShell from '../../libs/components/auth/AuthSoloShell';
import ResetPasswordForm from '../../libs/components/auth/ResetPasswordForm';
import AuthRecoveryAside from '../../libs/components/auth/AuthRecoveryAside';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const ResetPasswordPage: NextPage = () => (
	<AuthSoloShell label="Reset password" aside={<AuthRecoveryAside />}>
		<ResetPasswordForm />
	</AuthSoloShell>
);

export default withLayoutCourse(ResetPasswordPage, { title: 'Reset Password — Academics' });
