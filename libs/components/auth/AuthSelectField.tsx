import React, { SelectHTMLAttributes } from 'react';

interface AuthSelectOption {
	id: string;
	label: string;
}

interface AuthSelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	options: readonly AuthSelectOption[] | AuthSelectOption[];
	placeholder?: string;
	error?: string;
}

const AuthSelectField = ({
	id,
	label,
	options,
	placeholder = 'Select…',
	error,
	className,
	...rest
}: AuthSelectFieldProps) => {
	const fieldId = id || rest.name || label.replace(/\s+/g, '-').toLowerCase();
	const errorId = `${fieldId}-error`;

	return (
		<label className={`auth-field ${error ? 'is-error' : ''}`} htmlFor={fieldId}>
			<span className="auth-field-label">{label}</span>
			<select
				id={fieldId}
				className={`auth-field-input auth-field-select ${className ?? ''}`}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? errorId : undefined}
				{...rest}
			>
				<option value="">{placeholder}</option>
				{options.map((option) => (
					<option key={option.id} value={option.id}>
						{option.label}
					</option>
				))}
			</select>
			{error ? (
				<span id={errorId} className="auth-field-error" role="alert">
					{error}
				</span>
			) : null}
		</label>
	);
};

export default AuthSelectField;
