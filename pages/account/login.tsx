import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import AuthShell from '../../libs/components/auth/AuthShell';
import LoginForm from '../../libs/components/auth/LoginForm';
import AuthMarketingPanel from '../../libs/components/auth/AuthMarketingPanel';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

/** Premium login — shared marketplace header/footer + auth shell. */
const LoginPage: NextPage = () => (
	<AuthShell
		formLabel="Log in"
		marketingLabel="Why learners choose Academics"
		form={<LoginForm />}
		marketing={
			<AuthMarketingPanel
				quote="I finally feel confident speaking every day — Academics kept me on track."
				studentName="Sarah Kim"
				studentMeta="Student · South Korea"
				trustLine="Trusted by learners from around the world"
				showBenefits
			/>
		}
	/>
);

export default withLayoutCourse(LoginPage, { title: 'Login — Academics' });
