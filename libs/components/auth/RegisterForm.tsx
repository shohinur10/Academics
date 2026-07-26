import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AuthProgressBar from './AuthProgressBar';
import AuthButton from './AuthButton';
import AuthTextField from './AuthTextField';
import AuthSelectField from './AuthSelectField';
import AuthPasswordField from './AuthPasswordField';
import RoleSelectCards from './RoleSelectCards';
import SocialAuthButtons from './SocialAuthButtons';
import {
	LEARNING_GOALS,
	REGISTER_COUNTRIES,
	REGISTER_LANGUAGES,
	REGISTER_STEPS,
	RegisterFieldErrors,
	RegisterFormValues,
	RegisterRole,
	RegisterStep,
	emptyRegisterForm,
	labelForCountry,
	labelForLanguage,
	labelForLearningGoal,
	labelForRole,
	validateRegisterForm,
	validateRegisterStep,
} from '../../types/auth/register';
import { registerWithEmail } from '../../auth/register';
import { safeInternalPath } from '../../auth/safeInternalPath';

const DRAFT_KEY = 'academics.register.draft';

const displayOrDash = (value: string): string => (value?.trim() ? value : '—');

const loadDraft = (): { step: RegisterStep; form: RegisterFormValues } | null => {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.sessionStorage.getItem(DRAFT_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { step?: number; form?: RegisterFormValues };
		if (!parsed?.form) return null;
		const step = ([1, 2, 3].includes(parsed.step ?? 1) ? parsed.step : 1) as RegisterStep;
		return { step, form: { ...emptyRegisterForm(), ...parsed.form, acceptedTerms: false } };
	} catch {
		return null;
	}
};

const saveDraft = (step: RegisterStep, form: RegisterFormValues) => {
	if (typeof window === 'undefined') return;
	try {
		const { password: _password, confirmPassword: _confirm, acceptedTerms: _terms, ...safe } = form;
		window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, form: safe }));
	} catch {
		/* ignore quota */
	}
};

const clearDraft = () => {
	if (typeof window === 'undefined') return;
	try {
		window.sessionStorage.removeItem(DRAFT_KEY);
	} catch {
		/* ignore */
	}
};

const RegisterForm = () => {
	const router = useRouter();
	const headingRef = useRef<HTMLHeadingElement | null>(null);
	const skipInitialFocus = useRef(true);
	const [hydrated, setHydrated] = useState(false);
	const [step, setStep] = useState<RegisterStep>(1);
	const [form, setForm] = useState<RegisterFormValues>(emptyRegisterForm);
	const [errors, setErrors] = useState<RegisterFieldErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [banner, setBanner] = useState<string | null>(null);

	const stepMeta = useMemo(() => REGISTER_STEPS.find((item) => item.id === step)!, [step]);
	const termsErrorId = 'register-terms-error';

	useEffect(() => {
		const draft = loadDraft();
		if (draft) {
			setForm((prev) => ({ ...prev, ...draft.form }));
			setStep(draft.step);
		}
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (!hydrated) return;
		saveDraft(step, form);
	}, [hydrated, step, form]);

	useEffect(() => {
		if (!hydrated) return;
		if (skipInitialFocus.current) {
			skipInitialFocus.current = false;
			return;
		}
		headingRef.current?.focus();
	}, [step, hydrated]);

	const patch = <K extends keyof RegisterFormValues>(key: K, value: RegisterFormValues[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => {
			if (!prev[key as keyof RegisterFieldErrors] && !prev.form) return prev;
			const next = { ...prev };
			delete next[key as keyof RegisterFieldErrors];
			delete next.form;
			return next;
		});
		setBanner(null);
	};

	const goToStep = (nextStep: RegisterStep) => {
		setErrors({});
		setBanner(null);
		setStep(nextStep);
	};

	const goNext = () => {
		const nextErrors = validateRegisterStep(step, form);
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			setBanner('Please complete this step before continuing.');
			return;
		}
		setErrors({});
		setBanner(null);
		setStep((prev) => Math.min(3, prev + 1) as RegisterStep);
	};

	const goBack = () => {
		goToStep(Math.max(1, step - 1) as RegisterStep);
	};

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (submitting) return;

		if (step < 3) {
			goNext();
			return;
		}

		const nextErrors = validateRegisterForm(form);
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			if (nextErrors.fullName || nextErrors.email || nextErrors.password || nextErrors.confirmPassword) {
				setStep(1);
			} else if (nextErrors.country || nextErrors.language || nextErrors.learningGoal || nextErrors.role) {
				setStep(2);
			}
			setBanner('Please fix the highlighted fields.');
			return;
		}

		setSubmitting(true);
		setBanner(null);
		try {
			const result = await registerWithEmail(form);
			if (!result.ok) {
				setErrors(result.fieldErrors ?? {});
				setBanner(result.message);
				if (result.fieldErrors?.fullName || result.fieldErrors?.email || result.fieldErrors?.password) {
					setStep(1);
				}
				return;
			}
			clearDraft();
			const referrer = safeInternalPath(router.query.referrer, '/');
			await router.push(referrer);
		} catch {
			setBanner('Something went wrong while creating your account. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="auth-form-panel-inner">
			<AuthProgressBar step={step} onStepSelect={goToStep} />

			<header className="auth-form-header">
				<h1 ref={headingRef} tabIndex={-1} id="register-step-title">
					{stepMeta.title}
				</h1>
				<p id="register-step-subtitle">{stepMeta.subtitle}</p>
			</header>

			{step === 1 ? (
				<>
					<SocialAuthButtons intent="register" disabled={submitting} onMessage={setBanner} />
					<div className="auth-divider" role="separator" aria-label="or continue with email">
						<span>or continue with email</span>
					</div>
				</>
			) : null}

			{banner ? (
				<div className="auth-banner" role="alert">
					{banner}
				</div>
			) : null}

			<form
				className="auth-form"
				onSubmit={(e) => void onSubmit(e)}
				noValidate
				aria-labelledby="register-step-title"
				aria-describedby="register-step-subtitle"
			>
				{step === 1 ? (
					<div className="auth-step-panel" role="group" aria-label="Account information">
						<AuthTextField
							label="Full Name"
							name="fullName"
							autoComplete="name"
							placeholder="Your full name"
							value={form.fullName}
							onChange={(e) => patch('fullName', e.target.value)}
							error={errors.fullName}
							disabled={submitting}
							required
						/>
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
							label="Password"
							value={form.password}
							onChange={(value) => patch('password', value)}
							error={errors.password}
							disabled={submitting}
							showStrength
						/>
						<AuthPasswordField
							id="confirmPassword"
							label="Confirm Password"
							value={form.confirmPassword}
							onChange={(value) => patch('confirmPassword', value)}
							error={errors.confirmPassword}
							disabled={submitting}
							showStrength={false}
							autoComplete="new-password"
						/>
					</div>
				) : null}

				{step === 2 ? (
					<div className="auth-step-panel" role="group" aria-label="Learning preferences">
						<div className="auth-form-grid">
							<AuthSelectField
								label="Country"
								name="country"
								value={form.country}
								onChange={(e) => patch('country', e.target.value)}
								options={[...REGISTER_COUNTRIES]}
								placeholder="Select country"
								error={errors.country}
								disabled={submitting}
								required
							/>
							<AuthSelectField
								label="Preferred Language"
								name="language"
								value={form.language}
								onChange={(e) => patch('language', e.target.value)}
								options={[...REGISTER_LANGUAGES]}
								placeholder="Select language"
								error={errors.language}
								disabled={submitting}
								required
							/>
						</div>
						<AuthSelectField
							label="Learning Goal"
							name="learningGoal"
							value={form.learningGoal}
							onChange={(e) =>
								patch('learningGoal', e.target.value as RegisterFormValues['learningGoal'])
							}
							options={LEARNING_GOALS}
							placeholder="What do you want to learn?"
							error={errors.learningGoal}
							disabled={submitting}
							required
						/>
						<RoleSelectCards
							value={form.role}
							onChange={(role: RegisterRole) => patch('role', role)}
							error={errors.role}
							disabled={submitting}
						/>
					</div>
				) : null}

				{step === 3 ? (
					<div className="auth-step-panel" role="group" aria-label="Review and create account">
						<section className="auth-review" aria-label="Account summary">
							<h2 className="auth-review-heading">Account Summary</h2>
							<dl className="auth-review-list">
								<div>
									<dt>Full Name</dt>
									<dd>{displayOrDash(form.fullName)}</dd>
								</div>
								<div>
									<dt>Email</dt>
									<dd>{displayOrDash(form.email)}</dd>
								</div>
								<div>
									<dt>Role</dt>
									<dd>{labelForRole(form.role)}</dd>
								</div>
								<div>
									<dt>Learning Goal</dt>
									<dd>{displayOrDash(labelForLearningGoal(form.learningGoal))}</dd>
								</div>
								<div>
									<dt>Country</dt>
									<dd>{displayOrDash(labelForCountry(form.country))}</dd>
								</div>
								<div>
									<dt>Language</dt>
									<dd>{displayOrDash(labelForLanguage(form.language))}</dd>
								</div>
							</dl>
							<div className="auth-review-edits">
								<button type="button" className="auth-review-edit" onClick={() => goToStep(1)}>
									Edit account details
								</button>
								<button type="button" className="auth-review-edit" onClick={() => goToStep(2)}>
									Edit learning preferences
								</button>
							</div>
						</section>

						<div className={`auth-terms ${errors.acceptedTerms ? 'is-error' : ''}`}>
							<label className="auth-terms-label" htmlFor="register-terms">
								<input
									id="register-terms"
									type="checkbox"
									checked={form.acceptedTerms}
									onChange={(e) => patch('acceptedTerms', e.target.checked)}
									disabled={submitting}
									aria-invalid={Boolean(errors.acceptedTerms)}
									aria-describedby={errors.acceptedTerms ? termsErrorId : undefined}
								/>
								<span>
									I agree to the{' '}
									<Link href="/cs" className="auth-inline-link">
										Terms of Service
									</Link>{' '}
									and{' '}
									<Link href="/cs" className="auth-inline-link">
										Privacy Policy
									</Link>
									.
								</span>
							</label>
							{errors.acceptedTerms ? (
								<span id={termsErrorId} className="auth-field-error" role="alert">
									{errors.acceptedTerms}
								</span>
							) : null}
						</div>
					</div>
				) : null}

				<div className={`auth-step-actions ${step === 1 ? 'is-single' : ''}`}>
					{step > 1 ? (
						<AuthButton
							variant="secondary"
							className="auth-back-btn"
							onClick={goBack}
							disabled={submitting}
						>
							<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
							Back
						</AuthButton>
					) : null}

					{step < 3 ? (
						<AuthButton type="submit" variant="primary" className="auth-continue-btn" disabled={submitting}>
							Continue
							<ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" />
						</AuthButton>
					) : (
						<AuthButton
							type="submit"
							variant="primary"
							loading={submitting}
							disabled={!form.acceptedTerms}
						>
							{submitting ? 'Creating account…' : 'Create Account'}
							{!submitting ? <ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" /> : null}
						</AuthButton>
					)}
				</div>
			</form>

			<p className="auth-switch">
				Already have an account?{' '}
				<Link href="/account/login" className="auth-inline-link">
					Login
				</Link>
			</p>
		</div>
	);
};

export default RegisterForm;
