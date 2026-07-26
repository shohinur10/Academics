export interface LoginFormValues {
	email: string;
	password: string;
	rememberMe: boolean;
}

export interface LoginFieldErrors {
	email?: string;
	password?: string;
	form?: string;
}

export const emptyLoginForm = (): LoginFormValues => ({
	email: '',
	password: '',
	rememberMe: true,
});

export const LOGIN_REMEMBER_EMAIL_KEY = 'academics.login.rememberEmail';

export const validateLoginForm = (values: LoginFormValues): LoginFieldErrors => {
	const errors: LoginFieldErrors = {};
	if (!values.email.trim()) {
		errors.email = 'Email address is required.';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
		errors.email = 'Enter a valid email address.';
	}
	if (!values.password) {
		errors.password = 'Password is required.';
	} else if (values.password.length < 4) {
		errors.password = 'Password is too short.';
	}
	return errors;
};
