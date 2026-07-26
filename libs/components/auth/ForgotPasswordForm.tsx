import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import AuthButton from './AuthButton';
import AuthTextField from './AuthTextField';
import {
	ForgotPasswordErrors,
	ForgotPasswordValues,
	emptyForgotPassword,
	validateForgotPassword,
} from '../../types/auth/password';
import { requestPasswordReset } from '../../auth/password';

const ForgotPasswordForm = () => {
	const router = useRouter();
	const [form, setForm] = useState<ForgotPasswordValues>(emptyForgotPassword);
	const [errors, setErrors] = useState<ForgotPasswordErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [banner, setBanner] = useState<string | null>(null);
	const [sent, setSent] = useState(false);
	const [demoToken, setDemoToken] = useState<string | null>(null);

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (submitting) return;

		const nextErrors = validateForgotPassword(form);
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			setBanner('Please fix the highlighted fields.');
			return;
		}

		setSubmitting(true);
		setBanner(null);
		try {
			const result = await requestPasswordReset(form);
			if (!result.ok) {
				setErrors(result.fieldErrors ?? {});
				setBanner(result.message);
				return;
			}
			setSent(true);
			setDemoToken(result.demoToken ?? null);
			setBanner(null);
		} catch {
			setBanner('Something went wrong. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	if (sent) {
		return (
			<div className="auth-form-panel-inner auth-recovery-card">
				<div className="auth-success-icon" aria-hidden="true">
					<MarkEmailReadOutlinedIcon fontSize="large" />
				</div>
				<header className="auth-form-header">
					<h1>Check your email</h1>
					<p>
						If an account exists for <strong>{form.email.trim()}</strong>, you will receive reset
						instructions when email delivery is connected.
					</p>
				</header>

				{demoToken ? (
					<div className="auth-banner auth-banner-info" role="status">
						Email API is not connected yet. Use the demo reset link to continue testing the UI.
					</div>
				) : null}

				<div className="auth-step-actions is-single">
					{demoToken ? (
						<AuthButton
							variant="primary"
							onClick={() =>
								void router.push({
									pathname: '/account/reset-password',
									query: { token: demoToken },
								})
							}
						>
							Continue to reset password
							<ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" />
						</AuthButton>
					) : null}
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

	return (
		<div className="auth-form-panel-inner auth-recovery-card">
			<Link href="/account/login" passHref legacyBehavior>
				<a className="auth-text-back auth-text-back-top">
					<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
					Back to Login
				</a>
			</Link>

			<p className="auth-badge">Account recovery</p>
			<header className="auth-form-header">
				<h1>Forgot your password?</h1>
				<p>Enter your email and we will send you a link to reset your password.</p>
			</header>

			{banner ? (
				<div className="auth-banner" role="alert">
					{banner}
				</div>
			) : null}

			<form className="auth-form" onSubmit={(e) => void onSubmit(e)} noValidate>
				<AuthTextField
					label="Email Address"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@email.com"
					value={form.email}
					onChange={(e) => {
						setForm({ email: e.target.value });
						setErrors({});
						setBanner(null);
					}}
					error={errors.email}
					disabled={submitting}
					required
				/>

				<AuthButton
					type="submit"
					variant="primary"
					loading={submitting}
					disabled={!form.email.trim()}
				>
					{submitting ? 'Sending…' : 'Send Reset Link'}
					{!submitting ? <ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" /> : null}
				</AuthButton>
			</form>
		</div>
	);
};

export default ForgotPasswordForm;
