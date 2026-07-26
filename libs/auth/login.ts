import { initializeApollo } from '../../apollo/client';
import { LOGIN } from '../../apollo/user/mutation';
import {
	LOGIN_REMEMBER_EMAIL_KEY,
	LoginFormValues,
	validateLoginForm,
} from '../types/auth/login';
import { updateStorage, updateUserInfo } from './index';
import { clearAuthQuiet } from './session';

export interface LoginResult {
	ok: boolean;
	message: string;
	fieldErrors?: ReturnType<typeof validateLoginForm>;
}

/** Register maps email → memberNick; login uses the same convention. */
export const nickFromLoginEmail = (email: string): string => email.trim().toLowerCase();

export const persistRememberedEmail = (email: string, remember: boolean) => {
	if (typeof window === 'undefined') return;
	try {
		if (remember && email.trim()) {
			window.localStorage.setItem(LOGIN_REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
		} else {
			window.localStorage.removeItem(LOGIN_REMEMBER_EMAIL_KEY);
		}
	} catch {
		/* ignore */
	}
};

export const readRememberedEmail = (): string => {
	if (typeof window === 'undefined') return '';
	try {
		return window.localStorage.getItem(LOGIN_REMEMBER_EMAIL_KEY) ?? '';
	} catch {
		return '';
	}
};

/**
 * Login with email via existing GraphQL LOGIN mutation.
 * Email is sent as memberNick to match Register's signup mapping.
 */
export const loginWithEmail = async (values: LoginFormValues): Promise<LoginResult> => {
	const fieldErrors = validateLoginForm(values);
	if (Object.keys(fieldErrors).length) {
		return {
			ok: false,
			message: 'Please fix the highlighted fields.',
			fieldErrors,
		};
	}

	const apolloClient = await initializeApollo();
	const memberNick = nickFromLoginEmail(values.email);

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: {
				input: {
					memberNick,
					memberPassword: values.password,
				},
			},
			fetchPolicy: 'network-only',
		});

		const accessToken = result?.data?.login?.accessToken as string | undefined;
		if (!accessToken) {
			return {
				ok: false,
				message: 'Login did not return an access token. Please try again.',
			};
		}

		updateStorage({ jwtToken: accessToken });
		updateUserInfo(accessToken);
		persistRememberedEmail(values.email, values.rememberMe);

		return {
			ok: true,
			message: 'Logged in successfully.',
		};
	} catch (err: unknown) {
		clearAuthQuiet();
		const graphQLErrors = (err as { graphQLErrors?: { message?: string }[] })?.graphQLErrors;
		const message = graphQLErrors?.[0]?.message || (err as Error)?.message || 'Login failed.';
		const lower = message.toLowerCase();

		if (lower.includes('do not match') || lower.includes('password') || lower.includes('credential')) {
			return {
				ok: false,
				message: 'Email or password is incorrect. Please try again.',
				fieldErrors: { password: 'Incorrect email or password.' },
			};
		}
		if (lower.includes('blocked')) {
			return { ok: false, message: 'This account has been blocked. Contact support for help.' };
		}
		if (lower.includes('cannot query') || lower.includes('network') || lower.includes('fetch')) {
			return {
				ok: false,
				message: 'Login service is unavailable. Check your connection and try again.',
			};
		}
		return { ok: false, message };
	}
};

