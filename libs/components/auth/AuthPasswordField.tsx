import React, { useMemo, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { evaluatePasswordStrength } from '../../types/auth/register';

interface AuthPasswordFieldProps {
	id?: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	autoComplete?: string;
	showStrength?: boolean;
	disabled?: boolean;
	onCapsLockChange?: (on: boolean) => void;
}

const AuthPasswordField = ({
	id = 'password',
	label,
	value,
	onChange,
	error,
	autoComplete = 'new-password',
	showStrength = true,
	disabled,
	onCapsLockChange,
}: AuthPasswordFieldProps) => {
	const [visible, setVisible] = useState(false);
	const strength = useMemo(() => evaluatePasswordStrength(value), [value]);
	const errorId = `${id}-error`;
	const strengthId = `${id}-strength`;

	const syncCapsLock = (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
		if (!onCapsLockChange || !('getModifierState' in event.nativeEvent)) return;
		try {
			onCapsLockChange(event.nativeEvent.getModifierState('CapsLock'));
		} catch {
			/* unsupported */
		}
	};

	return (
		<div className={`auth-field auth-password-field ${error ? 'is-error' : ''}`}>
			<label className="auth-field-label" htmlFor={id}>
				{label}
			</label>
			<div className="auth-password-input-wrap">
				<input
					id={id}
					type={visible ? 'text' : 'password'}
					className="auth-field-input"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={syncCapsLock}
					onKeyUp={syncCapsLock}
					onClick={syncCapsLock}
					onBlur={() => onCapsLockChange?.(false)}
					autoComplete={autoComplete}
					disabled={disabled}
					aria-invalid={Boolean(error)}
					aria-describedby={
						[error ? errorId : null, showStrength && value ? strengthId : null]
							.filter(Boolean)
							.join(' ') || undefined
					}
				/>
				<button
					type="button"
					className="auth-password-toggle"
					onClick={() => setVisible((v) => !v)}
					aria-label={visible ? 'Hide password' : 'Show password'}
					disabled={disabled}
				>
					{visible ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
				</button>
			</div>

			{showStrength && value ? (
				<div id={strengthId} className="auth-password-strength" aria-live="polite">
					<div className="auth-password-meter" aria-hidden="true">
						<span className={`auth-password-meter-bar score-${strength.score}`} />
					</div>
					<p className="auth-password-strength-label">
						Strength: <strong>{strength.label}</strong>
					</p>
					<ul className="auth-password-reqs">
						<li className={strength.hasUpper ? 'met' : ''}>
							<span aria-hidden="true">{strength.hasUpper ? '✔' : '○'}</span> Uppercase
						</li>
						<li className={strength.hasLower ? 'met' : ''}>
							<span aria-hidden="true">{strength.hasLower ? '✔' : '○'}</span> Lowercase
						</li>
						<li className={strength.hasNumber ? 'met' : ''}>
							<span aria-hidden="true">{strength.hasNumber ? '✔' : '○'}</span> Number
						</li>
						<li className={strength.hasSpecial ? 'met' : ''}>
							<span aria-hidden="true">{strength.hasSpecial ? '✔' : '○'}</span> Special Character
						</li>
						<li className={strength.hasMinLength ? 'met' : ''}>
							<span aria-hidden="true">{strength.hasMinLength ? '✔' : '○'}</span> 8+ characters
						</li>
					</ul>
				</div>
			) : null}

			{error ? (
				<span id={errorId} className="auth-field-error" role="alert">
					{error}
				</span>
			) : null}
		</div>
	);
};

export default AuthPasswordField;
