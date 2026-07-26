import React from 'react';

interface AuthSoloShellProps {
	children: React.ReactNode;
	aside?: React.ReactNode;
	label?: string;
}

/** Centered auth card layout for forgot/reset flows (stacks aside below on mobile). */
const AuthSoloShell = ({ children, aside, label = 'Account recovery' }: AuthSoloShellProps) => (
	<div className="auth-register-page auth-solo-page">
		<div className={`auth-solo-shell ${aside ? 'has-aside' : ''}`}>
			<section className="auth-solo-main" aria-label={label}>
				{children}
			</section>
			{aside ? (
				<aside className="auth-solo-aside" aria-label="Helpful tips">
					{aside}
				</aside>
			) : null}
		</div>
	</div>
);

export default AuthSoloShell;
