import {
	FeaturedFaq,
	HelpAnnouncement,
	HelpContactOption,
	HelpTopic,
	SystemStatusItem,
} from '../types/support/helpCenter';

/** Isolated Help Center mocks until GraphQL support APIs exist. */

export const HELP_TOPICS: HelpTopic[] = [
	{
		id: 'account',
		title: 'Account & Login',
		description: 'Sign-in, password reset, profile, and account security.',
		articleCount: 18,
		href: '/support/faq?category=account',
	},
	{
		id: 'courses',
		title: 'Courses & Enrollment',
		description: 'Browse, enroll, progress, and course access issues.',
		articleCount: 24,
		href: '/support/faq?category=courses',
	},
	{
		id: 'payments',
		title: 'Payments & Refunds',
		description: 'Billing, invoices, refunds, and payment methods.',
		articleCount: 16,
		href: '/support/faq?category=payments',
	},
	{
		id: 'live',
		title: 'Live Classes',
		description: 'Schedules, joining sessions, and classroom tools.',
		articleCount: 12,
		href: '/support/faq?category=technical&q=live',
	},
	{
		id: 'certificates',
		title: 'Certificates',
		description: 'Completion certificates, downloads, and verification.',
		articleCount: 9,
		href: '/support/faq?category=certificates',
	},
	{
		id: 'technical',
		title: 'Technical Problems',
		description: 'Playback, uploads, browsers, and device troubleshooting.',
		articleCount: 21,
		href: '/support/faq?category=technical',
	},
	{
		id: 'instructors',
		title: 'Instructors',
		description: 'Teaching tools, payouts, and instructor account help.',
		articleCount: 14,
		href: '/support/faq?category=instructor',
	},
	{
		id: 'community',
		title: 'Community & Safety',
		description: 'Groups, moderation, reporting, and safety guidelines.',
		articleCount: 11,
		href: '/support/faq?category=community',
	},
];

export const FEATURED_FAQS: FeaturedFaq[] = [
	{
		id: 'faq-refund-policy',
		slug: 'refund-policy',
		title: 'How do refunds work on ACADEMICS?',
		excerpt: 'Learn eligibility windows, how to request a refund, and typical processing times.',
		category: 'Payments & Refunds',
		helpfulCount: 842,
	},
	{
		id: 'faq-certificate',
		slug: 'download-certificate',
		title: 'How do I download my course certificate?',
		excerpt: 'Certificates unlock after course completion. Follow these steps to download or share yours.',
		category: 'Certificates',
		helpfulCount: 691,
	},
	{
		id: 'faq-login',
		slug: 'cant-log-in',
		title: 'I can’t log in to my account',
		excerpt: 'Reset your password, clear session issues, or recover access with your registered email.',
		category: 'Account & Login',
		helpfulCount: 1204,
	},
	{
		id: 'faq-course-access',
		slug: 'course-access',
		title: 'Why can’t I access a course I enrolled in?',
		excerpt: 'Check enrollment status, payment confirmation, and device/browser requirements.',
		category: 'Courses & Enrollment',
		helpfulCount: 533,
	},
	{
		id: 'faq-live-join',
		slug: 'join-live-class',
		title: 'How do I join a live class on time?',
		excerpt: 'Find your session link, calendar reminder, and tips if the classroom won’t open.',
		category: 'Live Classes',
		helpfulCount: 418,
	},
	{
		id: 'faq-video',
		slug: 'video-wont-play',
		title: 'Course videos won’t play or keep buffering',
		excerpt: 'Quick fixes for bandwidth, browsers, and playback settings that resolve most issues.',
		category: 'Technical Problems',
		helpfulCount: 776,
	},
];

export const HELP_ANNOUNCEMENTS: HelpAnnouncement[] = [
	{
		id: 'ann-maintenance',
		slug: 'scheduled-maintenance-apr',
		badge: 'Maintenance',
		title: 'Scheduled maintenance window this Sunday',
		excerpt: 'Payments and certificate downloads may pause briefly between 02:00–03:00 KST.',
		publishedAt: '2026-07-20',
	},
	{
		id: 'ann-live',
		slug: 'live-classroom-upgrade',
		badge: 'Product',
		title: 'Live classroom quality upgrade',
		excerpt: 'We’ve improved audio stability and waiting-room controls for group sessions.',
		publishedAt: '2026-07-14',
	},
	{
		id: 'ann-policy',
		slug: 'community-safety-update',
		badge: 'Policy',
		title: 'Updated Community & Safety guidelines',
		excerpt: 'Clearer reporting flows and faster review for harassment and spam reports.',
		publishedAt: '2026-07-08',
	},
];

export const SYSTEM_STATUS: SystemStatusItem[] = [
	{ id: 'videos', name: 'Course Videos', status: 'operational' },
	{ id: 'payments', name: 'Payments', status: 'operational' },
	{ id: 'community', name: 'Community', status: 'operational' },
	{ id: 'certificates', name: 'Certificates', status: 'operational' },
	{ id: 'notifications', name: 'Notifications', status: 'operational' },
];

export const HELP_CONTACT_OPTIONS: HelpContactOption[] = [
	{
		id: 'chat',
		title: 'Live Chat',
		description: 'Chat with support during business hours for quick answers.',
		href: '/support/contact?channel=chat',
		cta: 'Start chat',
	},
	{
		id: 'request',
		title: 'Send Request',
		description: 'Open a ticket and track replies in My Support Requests.',
		href: '/support/contact?channel=request',
		cta: 'Create request',
	},
	{
		id: 'email',
		title: 'Email Support',
		description: 'Reach us at support@academics.app for detailed cases.',
		href: 'mailto:support@academics.app',
		cta: 'Email us',
	},
	{
		id: 'community',
		title: 'Community Help',
		description: 'Ask learners and instructors in the ACADEMICS Community.',
		href: '/community',
		cta: 'Open community',
	},
];

export const getFeaturedFaqBySlug = (slug: string) => FEATURED_FAQS.find((f) => f.slug === slug) ?? null;

export const getAnnouncementBySlug = (slug: string) => HELP_ANNOUNCEMENTS.find((a) => a.slug === slug) ?? null;
