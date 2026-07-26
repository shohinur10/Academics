import {
	ForgotPasswordErrors,
	ForgotPasswordValues,
	PASSWORD_RESET_PENDING_KEY,
	ResetPasswordErrors,
	ResetPasswordValues,
	validateForgotPassword,
	validateResetPassword,
} from '../types/auth/password';

export interface PasswordFlowResult {
	ok: boolean;
	message: string;
	fieldErrors?: ForgotPasswordErrors | ResetPasswordErrors;
	/** Demo token for local reset testing until email API exists. */
	demoToken?: string;
}

interface PendingReset {
	email: string;
	token: string;
	createdAt: string;
	expiresAt: string;
}

const createToken = (): string => {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID().replace(/-/g, '');
	}
	return `reset_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

const readPending = (): PendingReset | null => {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.sessionStorage.getItem(PASSWORD_RESET_PENDING_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as PendingReset;
	} catch {
		return null;
	}
};

const writePending = (pending: PendingReset) => {
	if (typeof window === 'undefined') return;
	try {
		window.sessionStorage.setItem(PASSWORD_RESET_PENDING_KEY, JSON.stringify(pending));
	} catch {
		/* ignore */
	}
};

const clearPending = () => {
	if (typeof window === 'undefined') return;
	try {
		window.sessionStorage.removeItem(PASSWORD_RESET_PENDING_KEY);
	} catch {
		/* ignore */
	}
};

/**
 * Request a password reset email.
 * No GraphQL mutation exists yet — validates input and prepares a demo token for the Reset UI.
 * Always returns a generic success message (does not reveal whether the email exists).
 */
export const requestPasswordReset = async (values: ForgotPasswordValues): Promise<PasswordFlowResult> => {
	const fieldErrors = validateForgotPassword(values);
	if (Object.keys(fieldErrors).length) {
		return {
			ok: false,
			message: 'Please fix the highlighted fields.',
			fieldErrors,
		};
	}

	// Simulate network latency for loading-state UX.
	await new Promise((resolve) => setTimeout(resolve, 450));

	const token = createToken();
	const now = Date.now();
	writePending({
		email: values.email.trim().toLowerCase(),
		token,
		createdAt: new Date(now).toISOString(),
		expiresAt: new Date(now + 60 * 60 * 1000).toISOString(),
	});

	return {
		ok: true,
		demoToken: token,
		message:
			'If an account exists for that email, password reset instructions will arrive shortly. Email delivery connects when the reset API is available.',
	};
};

/**
 * Reset password with token from the email link.
 * No GraphQL mutation exists yet — validates strength + demo token, then clears pending state.
 */
export const resetPasswordWithToken = async (
	values: ResetPasswordValues,
	token: string,
): Promise<PasswordFlowResult> => {
	const fieldErrors = validateResetPassword(values, token);
	if (Object.keys(fieldErrors).length) {
		return {
			ok: false,
			message: 'Please fix the highlighted fields.',
			fieldErrors,
		};
	}

	await new Promise((resolve) => setTimeout(resolve, 450));

	const pending = readPending();
	const expired = pending ? Date.parse(pending.expiresAt) < Date.now() : true;
	const tokenMatches = pending?.token === token;

	if (!pending || expired || !tokenMatches) {
		return {
			ok: false,
			message: 'This reset link is invalid or has expired. Request a new one.',
			fieldErrors: { token: 'Invalid or expired reset link.' },
		};
	}

	clearPending();

	return {
		ok: true,
		message:
			'Your password has been updated in this demo flow. Connect the reset API to persist changes on the server.',
	};
};

export const isResetTokenPresent = (token: unknown): token is string =>
	typeof token === 'string' && token.trim().length >= 8;
