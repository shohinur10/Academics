import React, { ButtonHTMLAttributes } from 'react';

type AuthButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: AuthButtonVariant;
	loading?: boolean;
}

const AuthButton = ({
	variant = 'primary',
	loading = false,
	className,
	children,
	disabled,
	type = 'button',
	...rest
}: AuthButtonProps) => (
	<button
		type={type}
		className={`auth-btn auth-btn-${variant} ${loading ? 'is-loading' : ''} ${className ?? ''}`.trim()}
		disabled={disabled || loading}
		aria-busy={loading || undefined}
		{...rest}
	>
		{children}
	</button>
);

export default AuthButton;
