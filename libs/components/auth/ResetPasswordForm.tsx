import React, { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import AuthButton from './AuthButton';
import AuthPasswordField from './AuthPasswordField';
import {
	ResetPasswordErrors,
	ResetPasswordValues,
	emptyResetPassword,
	validateResetPassword,
} from '../../types/auth/password';
import { isResetTokenPresent, resetPasswordWithToken } from '../../auth/password';

const ResetPasswordForm = () => {
	const router = useRouter();
	const token = typeof router.query.token === 'string' ? router.query.token : '';
	const tokenReady = router.isReady;
	const hasToken = isResetTokenPresent(token);

	const [form, setForm] = useState<ResetPasswordValues>(emptyResetPassword);
	const [errors, setErrors] = useState<ResetPasswordErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [banner, setBanner] = useState<string | null>(null);
	const [done, setDone] = useState(false);
	const [capsLockOn, setCapsLockOn] = useState(false);

	const invalidLink = useMemo(() => tokenReady && !hasToken, [tokenReady, hasToken]);

	const patch = <K extends keyof ResetPasswordValues>(key: K, value: ResetPasswordValues[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => {
			const next = { ...prev };
			delete next[key];
			delete next.form;
			delete next.token;
			return next;
		});
		setBanner(null);
	};

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (submitting || !hasToken) return;

		const nextErrors = validateResetPassword(form, token);
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			setBanner('Please fix the highlighted fields.');
			return;
		}

		setSubmitting(true);
		setBanner(null);
		try {
			const result = await resetPasswordWithToken(form, token);
			if (!result.ok) {
				setErrors(result.fieldErrors ?? {});
				setBanner(result.message);
				return;
			}
			setDone(true);
		} catch {
			setBanner('Something went wrong while resetting your password.');
		} finally {
			setSubmitting(false);
		}
	};

	if (!tokenReady) {
		return (
			<div className="auth-form-panel-inner auth-recovery-card" aria-busy="true">
				<p className="auth-switch">Loading reset form…</p>
			</div>
		);
	}

	if (invalidLink) {
		return (
			<div className="auth-form-panel-inner auth-recovery-card">
				<header className="auth-form-header">
					<h1>Link unavailable</h1>
					<p>This password reset link is missing or invalid. Request a new one to continue.</p>
				</header>
				<div className="auth-step-actions is-single">
					<AuthButton variant="primary" onClick={() => void router.push('/account/forgot-password')}>
						Request new link
					</AuthButton>
					<Link href="/account/login" passHref legacyBehavior>
						<a className="auth-text-back">
							<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
							Back to Login
						</a>
					</Link>
				</div>
			</div>
		);
	}

	if (done) {
		return (
			<div className="auth-form-panel-inner auth-recovery-card">
				<div className="auth-success-icon" aria-hidden="true">
					<LockResetRoundedIcon fontSize="large" />
				</div>
				<header className="auth-form-header">
					<h1>Password updated</h1>
					<p>You can now sign in with your new password.</p>
				</header>
				<div className="auth-banner auth-banner-success" role="status">
					Demo reset completed. Server persistence requires the reset API.
				</div>
				<div className="auth-step-actions is-single">
					<AuthButton variant="primary" onClick={() => void router.push('/account/login')}>
						Go to Login
						<ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" />
					</AuthButton>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-form-panel-inner auth-recovery-card">
			<Link href="/account/login" passHref legacyBehavior>
				<a className="auth-text-back auth-text-back-top">
					<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
					Back to Login
				</a>
			</Link>

			<div className="auth-lock-badge" aria-hidden="true">
				<LockResetRoundedIcon />
			</div>

			<header className="auth-form-header">
				<h1>Create new password</h1>
				<p>Choose a strong password you have not used before.</p>
			</header>

			{banner ? (
				<div className="auth-banner" role="alert">
					{banner}
				</div>
			) : null}
			{errors.token ? (
				<div className="auth-banner" role="alert">
					{errors.token}
				</div>
			) : null}

			<form className="auth-form" onSubmit={(e) => void onSubmit(e)} noValidate>
				<AuthPasswordField
					id="newPassword"
					label="New Password"
					value={form.password}
					onChange={(value) => patch('password', value)}
					error={errors.password}
					disabled={submitting}
					showStrength
					autoComplete="new-password"
					onCapsLockChange={setCapsLockOn}
				/>
				{capsLockOn ? (
					<p className="auth-caps-warning" role="status" aria-live="polite">
						Caps Lock is on
					</p>
				) : null}
				<AuthPasswordField
					id="confirmNewPassword"
					label="Confirm New Password"
					value={form.confirmPassword}
					onChange={(value) => patch('confirmPassword', value)}
					error={errors.confirmPassword}
					disabled={submitting}
					showStrength={false}
					autoComplete="new-password"
				/>

				<AuthButton
					type="submit"
					variant="primary"
					loading={submitting}
					disabled={!form.password || !form.confirmPassword}
				>
					{submitting ? 'Updating…' : 'Reset Password'}
					{!submitting ? <ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" /> : null}
				</AuthButton>
			</form>
		</div>
	);
};

export default ResetPasswordForm;
