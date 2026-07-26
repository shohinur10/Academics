import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import KeyboardCapslockRoundedIcon from '@mui/icons-material/KeyboardCapslockRounded';
import AuthButton from './AuthButton';
import AuthTextField from './AuthTextField';
import AuthPasswordField from './AuthPasswordField';
import SocialAuthButtons from './SocialAuthButtons';
import {
	LoginFieldErrors,
	LoginFormValues,
	emptyLoginForm,
	validateLoginForm,
} from '../../types/auth/login';
import { loginWithEmail, readRememberedEmail } from '../../auth/login';
import { safeInternalPath } from '../../auth/safeInternalPath';

const LoginForm = () => {
	const router = useRouter();
	const [form, setForm] = useState<LoginFormValues>(emptyLoginForm);
	const [errors, setErrors] = useState<LoginFieldErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [banner, setBanner] = useState<string | null>(null);
	const [capsLockOn, setCapsLockOn] = useState(false);

	useEffect(() => {
		const remembered = readRememberedEmail();
		if (remembered) {
			setForm((prev) => ({ ...prev, email: remembered, rememberMe: true }));
		}
	}, []);

	const patch = <K extends keyof LoginFormValues>(key: K, value: LoginFormValues[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => {
			if (!prev[key as keyof LoginFieldErrors] && !prev.form) return prev;
			const next = { ...prev };
			delete next[key as keyof LoginFieldErrors];
			delete next.form;
			return next;
		});
		setBanner(null);
	};

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (submitting) return;

		const nextErrors = validateLoginForm(form);
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			setBanner('Please fix the highlighted fields.');
			return;
		}

		setSubmitting(true);
		setBanner(null);
		try {
			const result = await loginWithEmail(form);
			if (!result.ok) {
				setErrors(result.fieldErrors ?? {});
				setBanner(result.message);
				return;
			}
			const referrer = safeInternalPath(router.query.referrer, '/');
			await router.push(referrer);
		} catch {
			setBanner('Something went wrong while signing in. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="auth-form-panel-inner">
			<p className="auth-badge">Welcome Back</p>
			<header className="auth-form-header">
				<h1 id="login-title">Continue Learning</h1>
				<p>Log in to continue your language learning journey.</p>
			</header>

			<SocialAuthButtons intent="login" disabled={submitting} onMessage={setBanner} />

			<div className="auth-divider" role="separator" aria-label="or continue with email">
				<span>or continue with email</span>
			</div>

			{banner ? (
				<div className="auth-banner" role="alert">
					{banner}
				</div>
			) : null}

			<form
				className="auth-form"
				onSubmit={(e) => void onSubmit(e)}
				noValidate
				aria-labelledby="login-title"
			>
				<AuthTextField
					label="Email Address"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@email.com"
					value={form.email}
					onChange={(e) => patch('email', e.target.value)}
					error={errors.email}
					disabled={submitting}
					required
				/>

				<AuthPasswordField
					id="loginPassword"
					label="Password"
					value={form.password}
					onChange={(value) => patch('password', value)}
					error={errors.password}
					disabled={submitting}
					showStrength={false}
					autoComplete="current-password"
					onCapsLockChange={setCapsLockOn}
				/>

				{capsLockOn ? (
					<p className="auth-caps-warning" role="status" aria-live="polite">
						<KeyboardCapslockRoundedIcon fontSize="inherit" aria-hidden="true" />
						Caps Lock is on
					</p>
				) : null}

				<div className="auth-login-meta">
					<label className="auth-remember">
						<input
							type="checkbox"
							checked={form.rememberMe}
							onChange={(e) => patch('rememberMe', e.target.checked)}
							disabled={submitting}
						/>
						<span>Remember me</span>
					</label>
					<Link href="/account/forgot-password" className="auth-inline-link auth-forgot-link">
						Forgot Password?
					</Link>
				</div>

				<AuthButton
					type="submit"
					variant="primary"
					className="auth-continue-btn"
					loading={submitting}
					disabled={!form.email.trim() || !form.password}
				>
					{submitting ? 'Signing in…' : 'Login'}
					{!submitting ? <ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" /> : null}
				</AuthButton>
			</form>

			<p className="auth-switch">
				Don&apos;t have an account?{' '}
				<Link href="/account/register" className="auth-inline-link">
					Create Account
				</Link>
			</p>
		</div>
	);
};

export default LoginForm;
