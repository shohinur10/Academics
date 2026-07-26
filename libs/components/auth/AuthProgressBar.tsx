import React from 'react';
import { REGISTER_STEPS, RegisterStep } from '../../types/auth/register';

interface AuthProgressBarProps {
	step: RegisterStep;
	onStepSelect?: (step: RegisterStep) => void;
}

const AuthProgressBar = ({ step, onStepSelect }: AuthProgressBarProps) => {
	const percent = Math.round((step / REGISTER_STEPS.length) * 100);

	return (
		<div className="auth-progress">
			<div className="auth-progress-meta">
				<p className="auth-step" aria-live="polite">
					Step <strong>{step}</strong> of {REGISTER_STEPS.length}
				</p>
				<span className="auth-progress-percent" aria-hidden="true">
					{percent}%
				</span>
			</div>
			<div
				className="auth-progress-track"
				role="progressbar"
				aria-label="Registration progress"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={percent}
				aria-valuetext={`Step ${step} of ${REGISTER_STEPS.length}`}
			>
				<span className="auth-progress-fill" style={{ width: `${percent}%` }} />
			</div>
			<ol className="auth-progress-steps">
				{REGISTER_STEPS.map((item) => {
					const status = item.id < step ? 'is-done' : item.id === step ? 'is-current' : 'is-upcoming';
					const canJump = Boolean(onStepSelect) && item.id < step;
					return (
						<li key={item.id} className={`auth-progress-step ${status}`}>
							{canJump ? (
								<button
									type="button"
									className="auth-progress-jump"
									onClick={() => onStepSelect?.(item.id)}
									aria-label={`Go back to ${item.title}`}
								>
									<span className="auth-progress-dot" aria-hidden="true">
										✓
									</span>
									<span className="auth-progress-label">{item.title}</span>
								</button>
							) : (
								<>
									<span className="auth-progress-dot" aria-hidden="true">
										{item.id < step ? '✓' : item.id}
									</span>
									<span className="auth-progress-label">{item.title}</span>
								</>
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
};

export default AuthProgressBar;
