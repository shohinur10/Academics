import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import AuthShell from '../../libs/components/auth/AuthShell';
import RegisterForm from '../../libs/components/auth/RegisterForm';
import RegisterMarketingPanel from '../../libs/components/auth/RegisterMarketingPanel';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** Premium multi-step registration onboarding for Academics. */
const RegisterPage: NextPage = () => (
	<AuthShell form={<RegisterForm />} marketing={<RegisterMarketingPanel />} />
);

export default withLayoutCourse(RegisterPage, { title: 'Create Account — Academics' });
