import React from 'react';
import AuthMarketingPanel from './AuthMarketingPanel';

/** Register-specific marketing panel — shared stats/illustration with Register copy. */
const RegisterMarketingPanel = () => (
	<AuthMarketingPanel
		quote="The best platform for learning new languages."
		studentName="Mina Park"
		studentMeta="Student · Korean → English"
		trustLine="Join thousands of happy learners worldwide"
		showBenefits
	/>
);

export default RegisterMarketingPanel;
