import { initializeApollo } from '../../apollo/client';
import { SIGN_UP, UPDATE_MEMBER } from '../../apollo/user/mutation';
import { MemberType } from '../enums/member.enum';
import {
	PendingRegisterProfile,
	REGISTER_PENDING_KEY,
	RegisterFormValues,
	roleToMemberType,
	validateRegisterForm,
} from '../types/auth/register';
import { updateStorage, updateUserInfo } from './index';
import { clearAuthQuiet } from './session';
import { SocialProvider, startSocialAuth } from './social';

export type { SocialProvider } from './social';

export interface RegisterResult {
	ok: boolean;
	message: string;
	fieldErrors?: ReturnType<typeof validateRegisterForm>;
}

/**
 * Derive a unique phone placeholder from email until phone is collected in onboarding.
 * Backend MemberInput currently requires memberPhone.
 */
export const phonePlaceholderFromEmail = (email: string): string => {
	let hash = 0;
	for (let i = 0; i < email.length; i += 1) {
		hash = (hash * 31 + email.charCodeAt(i)) % 1_000_000_000;
	}
	return `010${String(Math.abs(hash)).padStart(8, '0').slice(0, 8)}`;
};

/** Use email as memberNick — nickname can be customized later in profile/onboarding. */
export const nickFromEmail = (email: string): string => email.trim().toLowerCase();

export const savePendingRegisterProfile = (values: RegisterFormValues) => {
	if (typeof window === 'undefined') return;
	const pending: PendingRegisterProfile = {
		fullName: values.fullName.trim(),
		email: values.email.trim().toLowerCase(),
		country: values.country,
		language: values.language,
		learningGoal: values.learningGoal,
		role: values.role,
		createdAt: new Date().toISOString(),
	};
	try {
		window.sessionStorage.setItem(REGISTER_PENDING_KEY, JSON.stringify(pending));
	} catch {
		/* ignore quota */
	}
};

/**
 * Isolated social auth entry — no OAuth providers are wired in this codebase yet.
 */
export const startSocialRegister = async (provider: SocialProvider): Promise<RegisterResult> =>
	startSocialAuth(provider, 'register');

/**
 * Register with email using existing GraphQL signup.
 * Maps design fields onto MemberInput (email → nick, synthetic phone, role → memberType).
 * Attempts UPDATE_MEMBER for full name when signup succeeds.
 */
export const registerWithEmail = async (values: RegisterFormValues): Promise<RegisterResult> => {
	const fieldErrors = validateRegisterForm(values);
	if (Object.keys(fieldErrors).length) {
		return {
			ok: false,
			message: 'Please fix the highlighted fields.',
			fieldErrors,
		};
	}

	const apolloClient = await initializeApollo();
	const memberNick = nickFromEmail(values.email);
	const memberPhone = phonePlaceholderFromEmail(memberNick);
	const memberType: MemberType = roleToMemberType(values.role);

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: {
					memberNick,
					memberPassword: values.password,
					memberPhone,
					memberType,
				},
			},
			fetchPolicy: 'network-only',
		});

		const accessToken = result?.data?.signup?.accessToken as string | undefined;
		if (!accessToken) {
			return {
				ok: false,
				message: 'Signup did not return an access token. Please try again.',
			};
		}

		updateStorage({ jwtToken: accessToken });
		updateUserInfo(accessToken);
		savePendingRegisterProfile(values);

		try {
			await apolloClient.mutate({
				mutation: UPDATE_MEMBER,
				variables: {
					input: {
						_id: result.data.signup._id,
						memberFullName: values.fullName.trim(),
					},
				},
				fetchPolicy: 'network-only',
			});
		} catch {
			/* full name can be set during onboarding if update fails */
		}

		return {
			ok: true,
			message: 'Account created successfully.',
		};
	} catch (err: unknown) {
		clearAuthQuiet();
		const graphQLErrors = (err as { graphQLErrors?: { message?: string }[] })?.graphQLErrors;
		const message = graphQLErrors?.[0]?.message || (err as Error)?.message || 'Registration failed.';
		if (message.toLowerCase().includes('already') || message.toLowerCase().includes('exist')) {
			return { ok: false, message: 'An account with this email already exists. Please log in.' };
		}
		if (message.toLowerCase().includes('cannot query') || message.toLowerCase().includes('network')) {
			return {
				ok: false,
				message: 'Registration service is unavailable. Check your connection and try again.',
			};
		}
		return { ok: false, message };
	}
};
