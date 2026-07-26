import React, { useState } from 'react';
import { SocialProvider, startSocialAuth } from '../../auth/social';

interface SocialAuthButtonsProps {
	disabled?: boolean;
	intent?: 'login' | 'register';
	onMessage?: (message: string) => void;
}

const PROVIDERS: { id: SocialProvider; label: string; className: string }[] = [
	{ id: 'google', label: 'Continue with Google', className: 'is-google' },
	{ id: 'apple', label: 'Continue with Apple', className: 'is-apple' },
	{ id: 'kakao', label: 'Continue with Kakao', className: 'is-kakao' },
	{ id: 'naver', label: 'Continue with Naver', className: 'is-naver' },
];

const SocialAuthButtons = ({ disabled, intent = 'login', onMessage }: SocialAuthButtonsProps) => {
	const [busy, setBusy] = useState<SocialProvider | null>(null);

	const handleClick = async (provider: SocialProvider) => {
		setBusy(provider);
		try {
			const result = await startSocialAuth(provider, intent);
			onMessage?.(result.message);
		} finally {
			setBusy(null);
		}
	};

	return (
		<div className="auth-social" role="group" aria-label={intent === 'login' ? 'Social sign in' : 'Social sign up'}>
			{PROVIDERS.map((provider) => (
				<button
					key={provider.id}
					type="button"
					className={`auth-social-btn ${provider.className}`}
					disabled={disabled || Boolean(busy)}
					aria-busy={busy === provider.id}
					onClick={() => void handleClick(provider.id)}
				>
					<span className="auth-social-mark" aria-hidden="true">
						{provider.id === 'google' && 'G'}
						{provider.id === 'apple' && 'A'}
						{provider.id === 'kakao' && 'K'}
						{provider.id === 'naver' && 'N'}
					</span>
					{busy === provider.id ? 'Connecting…' : provider.label}
				</button>
			))}
		</div>
	);
};

export default SocialAuthButtons;
