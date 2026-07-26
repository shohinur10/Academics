import { evaluatePasswordStrength } from './register';

export interface ForgotPasswordValues {
	email: string;
}

export interface ForgotPasswordErrors {
	email?: string;
	form?: string;
}

export interface ResetPasswordValues {
	password: string;
	confirmPassword: string;
}

export interface ResetPasswordErrors {
	password?: string;
	confirmPassword?: string;
	token?: string;
	form?: string;
}

export const emptyForgotPassword = (): ForgotPasswordValues => ({ email: '' });

export const emptyResetPassword = (): ResetPasswordValues => ({
	password: '',
	confirmPassword: '',
});

export const validateForgotPassword = (values: ForgotPasswordValues): ForgotPasswordErrors => {
	const errors: ForgotPasswordErrors = {};
	if (!values.email.trim()) {
		errors.email = 'Email address is required.';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
		errors.email = 'Enter a valid email address.';
	}
	return errors;
};

export const validateResetPassword = (
	values: ResetPasswordValues,
	token?: string,
): ResetPasswordErrors => {
	const errors: ResetPasswordErrors = {};
	const strength = evaluatePasswordStrength(values.password);

	if (!token?.trim()) {
		errors.token = 'This reset link is invalid or incomplete.';
	}
	if (!values.password) {
		errors.password = 'Password is required.';
	} else if (strength.score < 4 || !strength.hasMinLength) {
		errors.password = 'Password must meet all requirements (8+ characters).';
	}
	if (!values.confirmPassword) {
		errors.confirmPassword = 'Please confirm your password.';
	} else if (values.confirmPassword !== values.password) {
		errors.confirmPassword = 'Passwords do not match.';
	}
	return errors;
};

export const PASSWORD_RESET_PENDING_KEY = 'academics.password.reset.pending';
