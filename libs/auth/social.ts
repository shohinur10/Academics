export type SocialProvider = 'google' | 'apple' | 'kakao' | 'naver';

export interface SocialAuthResult {
	ok: boolean;
	message: string;
}

/**
 * Isolated social auth entry — no OAuth providers are wired yet.
 * Shared by Login and Register placeholders.
 */
export const startSocialAuth = async (
	provider: SocialProvider,
	intent: 'login' | 'register' = 'login',
): Promise<SocialAuthResult> => {
	const label = `${provider[0].toUpperCase()}${provider.slice(1)}`;
	const action = intent === 'login' ? 'sign-in' : 'sign-up';
	return {
		ok: false,
		message: `${label} ${action} is not connected yet. Continue with email for now.`,
	};
};
