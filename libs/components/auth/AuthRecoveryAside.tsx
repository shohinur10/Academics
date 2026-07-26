import React from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const TIPS = [
	'Use at least 8 characters',
	'Mix upper and lowercase letters',
	'Include a number and special character',
	'Avoid reusing passwords from other sites',
] as const;

const AuthRecoveryAside = () => (
	<div className="auth-recovery-aside">
		<h2>Keep your account secure</h2>
		<p>A strong unique password protects your courses, messages, and certificates.</p>
		<ul>
			{TIPS.map((tip) => (
				<li key={tip}>
					<span className="auth-benefit-check" aria-hidden="true">
						<CheckRoundedIcon fontSize="inherit" />
					</span>
					{tip}
				</li>
			))}
		</ul>
	</div>
);

export default AuthRecoveryAside;
