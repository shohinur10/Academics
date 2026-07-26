import React from 'react';

interface AuthShellProps {
	form: React.ReactNode;
	marketing: React.ReactNode;
	formLabel?: string;
	marketingLabel?: string;
}

/** Split-screen auth layout: form left, marketing right (stacks on mobile). */
const AuthShell = ({
	form,
	marketing,
	formLabel = 'Authentication',
	marketingLabel = 'Why Academics',
}: AuthShellProps) => (
	<div className="auth-register-page">
		<div className="auth-register-shell">
			<section className="auth-register-form-panel" aria-label={formLabel}>
				{form}
			</section>
			<aside className="auth-register-marketing-panel" aria-label={marketingLabel}>
				{marketing}
			</aside>
		</div>
	</div>
);

export default AuthShell;
