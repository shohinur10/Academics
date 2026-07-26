import React, { InputHTMLAttributes } from 'react';

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	hint?: string;
}

const AuthTextField = ({ id, label, error, hint, className, ...rest }: AuthTextFieldProps) => {
	const fieldId = id || rest.name || label.replace(/\s+/g, '-').toLowerCase();
	const errorId = `${fieldId}-error`;
	const hintId = `${fieldId}-hint`;

	return (
		<label className={`auth-field ${error ? 'is-error' : ''}`} htmlFor={fieldId}>
			<span className="auth-field-label">{label}</span>
			<input
				id={fieldId}
				className={`auth-field-input ${className ?? ''}`}
				aria-invalid={Boolean(error)}
				aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
				{...rest}
			/>
			{hint && !error ? (
				<span id={hintId} className="auth-field-hint">
					{hint}
				</span>
			) : null}
			{error ? (
				<span id={errorId} className="auth-field-error" role="alert">
					{error}
				</span>
			) : null}
		</label>
	);
};

export default AuthTextField;
