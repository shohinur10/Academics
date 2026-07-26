import { MemberType } from '../../enums/member.enum';

export type RegisterRole = 'student' | 'instructor';

export type LearningGoalId =
	| 'english'
	| 'korean'
	| 'japanese'
	| 'chinese'
	| 'ielts'
	| 'topik'
	| 'business-english'
	| 'conversation'
	| 'grammar'
	| 'vocabulary';

export interface RegisterFormValues {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
	country: string;
	language: string;
	learningGoal: LearningGoalId | '';
	role: RegisterRole;
	acceptedTerms: boolean;
}

export interface RegisterFieldErrors {
	fullName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	country?: string;
	language?: string;
	learningGoal?: string;
	role?: string;
	acceptedTerms?: string;
	form?: string;
}

export interface PasswordStrength {
	score: number;
	label: string;
	hasUpper: boolean;
	hasLower: boolean;
	hasNumber: boolean;
	hasSpecial: boolean;
	hasMinLength: boolean;
}

export const emptyRegisterForm = (): RegisterFormValues => ({
	fullName: '',
	email: '',
	password: '',
	confirmPassword: '',
	country: '',
	language: 'en',
	learningGoal: '',
	role: 'student',
	acceptedTerms: false,
});

export const REGISTER_COUNTRIES = [
	{ id: 'KR', label: 'South Korea' },
	{ id: 'US', label: 'United States' },
	{ id: 'JP', label: 'Japan' },
	{ id: 'CN', label: 'China' },
	{ id: 'GB', label: 'United Kingdom' },
	{ id: 'UZ', label: 'Uzbekistan' },
	{ id: 'VN', label: 'Vietnam' },
	{ id: 'TH', label: 'Thailand' },
	{ id: 'DE', label: 'Germany' },
	{ id: 'FR', label: 'France' },
	{ id: 'OTHER', label: 'Other' },
] as const;

export const REGISTER_LANGUAGES = [
	{ id: 'en', label: 'English' },
	{ id: 'kr', label: 'Korean' },
	{ id: 'ru', label: 'Russian' },
	{ id: 'ja', label: 'Japanese' },
	{ id: 'zh', label: 'Chinese' },
] as const;

export const LEARNING_GOALS: { id: LearningGoalId; label: string }[] = [
	{ id: 'english', label: 'English' },
	{ id: 'korean', label: 'Korean' },
	{ id: 'japanese', label: 'Japanese' },
	{ id: 'chinese', label: 'Chinese' },
	{ id: 'ielts', label: 'IELTS' },
	{ id: 'topik', label: 'TOPIK' },
	{ id: 'business-english', label: 'Business English' },
	{ id: 'conversation', label: 'Conversation' },
	{ id: 'grammar', label: 'Grammar' },
	{ id: 'vocabulary', label: 'Vocabulary' },
];

export const roleToMemberType = (role: RegisterRole): MemberType =>
	role === 'instructor' ? MemberType.INSTRUCTOR : MemberType.USER;

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecial = /[^A-Za-z0-9]/.test(password);
	const hasMinLength = password.length >= 8;
	const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
	let label = 'Too weak';
	if (score === 4 && hasMinLength) label = 'Strong';
	else if (score === 4) label = 'Good';
	else if (score === 3) label = 'Fair';
	else if (score >= 1) label = 'Weak';
	return { score, label, hasUpper, hasLower, hasNumber, hasSpecial, hasMinLength };
};

export type RegisterStep = 1 | 2 | 3;

export const REGISTER_STEPS: {
	id: RegisterStep;
	title: string;
	subtitle: string;
}[] = [
	{
		id: 1,
		title: 'Account Information',
		subtitle: 'Create your login credentials to get started.',
	},
	{
		id: 2,
		title: 'Learning Preferences',
		subtitle: 'Tell us how you want to learn on Academics.',
	},
	{
		id: 3,
		title: 'Review',
		subtitle: 'Confirm your details and create your account.',
	},
];

export const validateRegisterStep = (
	step: RegisterStep,
	values: RegisterFormValues,
): RegisterFieldErrors => {
	const errors: RegisterFieldErrors = {};

	if (step === 1) {
		const strength = evaluatePasswordStrength(values.password);
		if (!values.fullName.trim() || values.fullName.trim().length < 2) {
			errors.fullName = 'Please enter your full name.';
		}
		if (!values.email.trim()) {
			errors.email = 'Email address is required.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
			errors.email = 'Enter a valid email address.';
		}
		if (!values.password) {
			errors.password = 'Password is required.';
		} else if (strength.score < 4 || !strength.hasMinLength) {
			errors.password = 'Password must meet all requirements (8+ characters).';
		}
		if (!values.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password.';
		} else if (values.confirmPassword !== values.password) {
			errors.confirmPassword = 'Passwords do not match.';
		}
	}

	if (step === 2) {
		if (!values.country) errors.country = 'Select your country.';
		if (!values.language) errors.language = 'Select a preferred language.';
		if (!values.learningGoal) errors.learningGoal = 'Select a learning goal.';
		if (!values.role) errors.role = 'Select Student or Instructor.';
	}

	if (step === 3) {
		if (!values.acceptedTerms) {
			errors.acceptedTerms = 'You must agree to the Terms and Privacy Policy.';
		}
	}

	return errors;
};

export const validateRegisterForm = (values: RegisterFormValues): RegisterFieldErrors => ({
	...validateRegisterStep(1, values),
	...validateRegisterStep(2, values),
	...validateRegisterStep(3, values),
});

export const labelForCountry = (id: string): string =>
	REGISTER_COUNTRIES.find((item) => item.id === id)?.label ?? id;

export const labelForLanguage = (id: string): string =>
	REGISTER_LANGUAGES.find((item) => item.id === id)?.label ?? id;

export const labelForLearningGoal = (id: string): string =>
	LEARNING_GOALS.find((item) => item.id === id)?.label ?? id;

export const labelForRole = (role: RegisterRole): string =>
	role === 'instructor' ? 'Instructor' : 'Student';

/** Persist onboarding preferences until the onboarding flow ships. */
export const REGISTER_PENDING_KEY = 'academics.register.pending';

export interface PendingRegisterProfile {
	fullName: string;
	email: string;
	country: string;
	language: string;
	learningGoal: LearningGoalId | '';
	role: RegisterRole;
	createdAt: string;
}
