import {
	FaqArticle,
	FaqCategoryId,
	FaqFilterOption,
	FaqListQuery,
	FaqSortOption,
	FAQ_CATEGORIES,
} from '../types/support/faq';

/** Isolated FAQ knowledge base until GraphQL support APIs exist. */

export const FAQ_ARTICLES: FaqArticle[] = [
	{
		id: 'faq-reset-password',
		slug: 'reset-password',
		category: 'account',
		question: 'How do I reset my password?',
		excerpt: 'Recover access with a secure reset link sent to your registered email.',
		answer:
			'Open the sign-in page and choose Forgot password. Enter the email on your ACADEMICS account, then open the reset link we send within 30 minutes.\n\nCreate a new password with at least 8 characters, including a number. After saving, sign in again on all devices.\n\nIf you do not receive the email, check spam, confirm the address, and wait a few minutes before requesting another link.',
		relatedSlugs: ['cant-log-in', 'change-email', 'account-security'],
		helpfulCount: 1280,
		updatedAt: '2026-07-18',
	},
	{
		id: 'faq-cant-log-in',
		slug: 'cant-log-in',
		category: 'account',
		question: 'I can’t log in to my account',
		excerpt: 'Fix common sign-in issues including session errors and wrong credentials.',
		answer:
			'Confirm you are using the email registered on ACADEMICS and that Caps Lock is off. Clear cookies for academics.app or try a private window.\n\nIf you recently changed your password, sign out of other browsers and try again. Social login users should use the same provider they originally chose.\n\nStill blocked? Reset your password or contact support with the exact error message you see.',
		relatedSlugs: ['reset-password', 'account-security', 'change-email'],
		helpfulCount: 1204,
		updatedAt: '2026-07-21',
	},
	{
		id: 'faq-change-email',
		slug: 'change-email',
		category: 'account',
		question: 'How do I change the email on my account?',
		excerpt: 'Update your login email from profile settings and verify the new address.',
		answer:
			'Go to My Page → Profile, then edit Email. Enter the new address and confirm with the verification code we send.\n\nYour previous email stops working for login after verification succeeds. Certificates and receipts keep historical emails for audit trails.\n\nInstructors with payout accounts may need to reconfirm tax contact details after an email change.',
		relatedSlugs: ['reset-password', 'cant-log-in', 'account-security'],
		helpfulCount: 512,
		updatedAt: '2026-07-10',
	},
	{
		id: 'faq-account-security',
		slug: 'account-security',
		category: 'account',
		question: 'How do I keep my ACADEMICS account secure?',
		excerpt: 'Best practices for passwords, sessions, and suspicious activity.',
		answer:
			'Use a unique password and enable device sign-out from Profile → Security when you use a shared computer.\n\nNever share verification codes. ACADEMICS staff will not ask for your password in chat or email.\n\nIf you notice unfamiliar enrollments or login alerts, reset your password immediately and contact support.',
		relatedSlugs: ['cant-log-in', 'reset-password', 'report-community'],
		helpfulCount: 390,
		updatedAt: '2026-06-28',
	},
	{
		id: 'faq-course-access',
		slug: 'course-access',
		category: 'courses',
		question: 'Why can’t I access a course I enrolled in?',
		excerpt: 'Check enrollment status, payment confirmation, and browser requirements.',
		answer:
			'Open My Courses and confirm the course shows as Enrolled. Pending payments unlock access after confirmation, which can take a few minutes.\n\nIf you joined via an organization seat, ask your admin to assign the license. Live-only courses may hide VOD until the session ends.\n\nTry another browser, disable strict tracking blockers for academics.app, then refresh. Still missing? Contact support with the course title and order ID.',
		relatedSlugs: ['refund-policy', 'join-live-class', 'video-wont-play'],
		helpfulCount: 533,
		updatedAt: '2026-07-19',
	},
	{
		id: 'faq-track-progress',
		slug: 'track-progress',
		category: 'courses',
		question: 'How is course progress calculated?',
		excerpt: 'Understand lesson completion, quizzes, and certificate thresholds.',
		answer:
			'Progress updates when you finish a lesson video (usually watching ~90%) and submit required quizzes or assignments.\n\nSome instructors weight projects more heavily—check the course syllabus for the certificate threshold.\n\nProgress syncs across devices after you are online. Offline downloads resume syncing when you reconnect.',
		relatedSlugs: ['download-certificate', 'course-access', 'video-wont-play'],
		helpfulCount: 448,
		updatedAt: '2026-07-12',
	},
	{
		id: 'faq-unenroll',
		slug: 'unenroll-course',
		category: 'courses',
		question: 'Can I unenroll from a course?',
		excerpt: 'Leave a course from My Courses and understand refund eligibility.',
		answer:
			'Open the course menu in My Courses and choose Unenroll. Your progress is archived and can be restored if you re-enroll later.\n\nUnenrolling does not automatically refund a purchase—see the refund policy for timelines.\n\nOrganization seats return to the admin pool after unenrollment.',
		relatedSlugs: ['refund-policy', 'course-access', 'track-progress'],
		helpfulCount: 301,
		updatedAt: '2026-07-05',
	},
	{
		id: 'faq-refund-policy',
		slug: 'refund-policy',
		category: 'payments',
		question: 'How do refunds work on ACADEMICS?',
		excerpt: 'Eligibility windows, how to request a refund, and processing times.',
		answer:
			'Most individual course purchases are eligible for a refund within 7 days if you have completed less than 20% of the content.\n\nRequest a refund from Order History → Request refund, or open a support ticket with your order ID. Approved refunds return to the original payment method in 5–10 business days.\n\nLive cohorts, bundles, and promotional seats may follow different windows shown at checkout.',
		relatedSlugs: ['payment-methods', 'invoice-receipt', 'course-access'],
		helpfulCount: 842,
		updatedAt: '2026-07-22',
	},
	{
		id: 'faq-payment-methods',
		slug: 'payment-methods',
		category: 'payments',
		question: 'Which payment methods are supported?',
		excerpt: 'Cards, regional methods, and failed payment troubleshooting.',
		answer:
			'ACADEMICS accepts major credit/debit cards and selected regional wallets depending on your country.\n\nIf a charge fails, confirm billing address matches your bank, try another card, or contact your issuer. 3-D Secure challenges must be completed to finish checkout.\n\nCorporate invoices are available for approved organizations—contact sales for net-30 options.',
		relatedSlugs: ['refund-policy', 'invoice-receipt', 'course-access'],
		helpfulCount: 620,
		updatedAt: '2026-07-15',
	},
	{
		id: 'faq-invoice',
		slug: 'invoice-receipt',
		category: 'payments',
		question: 'Where can I download invoices and receipts?',
		excerpt: 'Find PDF receipts for personal and organization purchases.',
		answer:
			'Go to My Page → Orders, open a purchase, and download Receipt (PDF). Organization admins see team invoices under Billing.\n\nReceipts include VAT/tax details based on your billing country at purchase time.\n\nNeed a corrected company name? Reply on the order or contact support within 30 days.',
		relatedSlugs: ['payment-methods', 'refund-policy', 'change-email'],
		helpfulCount: 410,
		updatedAt: '2026-07-09',
	},
	{
		id: 'faq-certificate',
		slug: 'download-certificate',
		category: 'certificates',
		question: 'How do I download my course certificate?',
		excerpt: 'Certificates unlock after you meet the completion requirements.',
		answer:
			'When you reach the certificate threshold, open the course → Certificate → Download PDF. You can also share a verification link.\n\nName on the certificate matches your profile display name at the moment of issue—update it before generating if needed.\n\nCertificates stay available in My Certificates even after the course archive date.',
		relatedSlugs: ['track-progress', 'verify-certificate', 'course-access'],
		helpfulCount: 691,
		updatedAt: '2026-07-20',
	},
	{
		id: 'faq-verify-certificate',
		slug: 'verify-certificate',
		category: 'certificates',
		question: 'How can employers verify my certificate?',
		excerpt: 'Share the public verification URL or certificate ID.',
		answer:
			'Each certificate includes a unique ID and public verification page. Share the link from Certificate → Share.\n\nEmployers can confirm your name, course title, and issue date without signing in.\n\nRevoked or fraudulent certificates show as invalid on the verification page.',
		relatedSlugs: ['download-certificate', 'track-progress', 'account-security'],
		helpfulCount: 355,
		updatedAt: '2026-07-11',
	},
	{
		id: 'faq-certificate-name',
		slug: 'certificate-name',
		category: 'certificates',
		question: 'My certificate shows the wrong name',
		excerpt: 'Update your display name and re-issue when eligible.',
		answer:
			'Edit your display name in Profile, then open the certificate and choose Re-issue if the course still allows edits.\n\nSome enterprise programs lock names after issuance—contact support with proof of legal name if you need a correction.\n\nOlder PDF downloads are not overwritten; download the new file after re-issue.',
		relatedSlugs: ['download-certificate', 'change-email', 'verify-certificate'],
		helpfulCount: 274,
		updatedAt: '2026-06-30',
	},
	{
		id: 'faq-join-community',
		slug: 'join-community',
		category: 'community',
		question: 'How do I join the ACADEMICS Community?',
		excerpt: 'Access discussions, study groups, and chat rooms from Community.',
		answer:
			'Sign in and open Community from the main navigation. You can browse topics, join study groups, and enter chat rooms that match your courses.\n\nSome groups require approval—request to join and wait for a moderator.\n\nFollow Community guidelines to keep discussions respectful and on-topic.',
		relatedSlugs: ['report-community', 'study-groups', 'community-safety'],
		helpfulCount: 488,
		updatedAt: '2026-07-16',
	},
	{
		id: 'faq-report-community',
		slug: 'report-community',
		category: 'community',
		question: 'How do I report a post or user?',
		excerpt: 'Use in-product reporting for spam, harassment, or unsafe content.',
		answer:
			'Open the post or profile menu and choose Report. Select a reason and add context. Our moderation team reviews priority reports first.\n\nFor urgent safety concerns, contact support with screenshots and URLs.\n\nFalse reports may lead to limited community privileges.',
		relatedSlugs: ['community-safety', 'join-community', 'account-security'],
		helpfulCount: 402,
		updatedAt: '2026-07-08',
	},
	{
		id: 'faq-study-groups',
		slug: 'study-groups',
		category: 'community',
		question: 'How do study groups work?',
		excerpt: 'Create or join groups, chat, and coordinate learning goals.',
		answer:
			'Browse Study Groups to join public groups or create your own with a topic and capacity. Members can post updates and share resources.\n\nGroup owners can approve joins, pin posts, and remove members who break rules.\n\nLeaving a group does not delete your past posts unless you remove them.',
		relatedSlugs: ['join-community', 'report-community', 'join-live-class'],
		helpfulCount: 366,
		updatedAt: '2026-07-13',
	},
	{
		id: 'faq-community-safety',
		slug: 'community-safety',
		category: 'community',
		question: 'What are the Community & Safety guidelines?',
		excerpt: 'Expectations for respectful collaboration on ACADEMICS.',
		answer:
			'Be respectful, avoid harassment, do not share pirated course materials, and keep personal data private.\n\nSpam, scams, and hate speech are removed. Repeat violations can lead to suspension.\n\nRead the full guidelines from Community → Safety for examples and appeal steps.',
		relatedSlugs: ['report-community', 'join-community', 'account-security'],
		helpfulCount: 319,
		updatedAt: '2026-07-08',
	},
	{
		id: 'faq-video',
		slug: 'video-wont-play',
		category: 'technical',
		question: 'Course videos won’t play or keep buffering',
		excerpt: 'Fixes for bandwidth, browsers, and playback settings.',
		answer:
			'Lower the player quality, pause downloads on the same network, and try Chrome or Edge on the latest version.\n\nDisable VPNs temporarily and allow media autoplay for academics.app. On mobile, switch between Wi-Fi and cellular to test.\n\nIf only one lesson fails, note the lesson title and timestamp when contacting support.',
		relatedSlugs: ['browser-requirements', 'course-access', 'upload-limits'],
		helpfulCount: 776,
		updatedAt: '2026-07-21',
	},
	{
		id: 'faq-browser',
		slug: 'browser-requirements',
		category: 'technical',
		question: 'Which browsers and devices are supported?',
		excerpt: 'Recommended setups for learning and teaching on ACADEMICS.',
		answer:
			'We support the latest two versions of Chrome, Edge, Firefox, and Safari on desktop. iOS Safari and Chrome for Android are supported for learning.\n\nInstructor studio tools work best on desktop Chrome. Live classes need a working camera/mic permission prompt.\n\nInternet Explorer is not supported.',
		relatedSlugs: ['video-wont-play', 'join-live-class', 'upload-limits'],
		helpfulCount: 290,
		updatedAt: '2026-07-02',
	},
	{
		id: 'faq-upload-limits',
		slug: 'upload-limits',
		category: 'technical',
		question: 'What are the file upload limits?',
		excerpt: 'Size and format limits for community and instructor uploads.',
		answer:
			'Community uploads support common image and document types up to 10MB per file. Instructor lesson assets may allow larger media through the course studio.\n\nCompress large PDFs or split archives if you hit the limit. Executable files are blocked.\n\nFailed uploads usually mean an unsupported type or unstable connection—retry on a stronger network.',
		relatedSlugs: ['browser-requirements', 'video-wont-play', 'instructor-payouts'],
		helpfulCount: 245,
		updatedAt: '2026-06-26',
	},
	{
		id: 'faq-live-join',
		slug: 'join-live-class',
		category: 'technical',
		question: 'How do I join a live class on time?',
		excerpt: 'Find your session link and fix classroom entry issues.',
		answer:
			'Open the course → Live schedule and join up to 10 minutes early. Calendar invites appear when you enable reminders.\n\nAllow camera/microphone permissions when prompted. If the room won’t open, refresh once and check that your system clock is accurate.\n\nRecordings (when enabled) appear under the same lesson after the session ends.',
		relatedSlugs: ['browser-requirements', 'course-access', 'video-wont-play'],
		helpfulCount: 418,
		updatedAt: '2026-07-17',
	},
	{
		id: 'faq-instructor-publish',
		slug: 'publish-course',
		category: 'instructor',
		question: 'How do I publish my instructor course?',
		excerpt: 'Checklist before your course goes live on the marketplace.',
		answer:
			'Complete required lessons, pricing, and a reviewable syllabus, then submit for quality review from Instructor Studio → Publish.\n\nReviews usually finish within a few business days. Fix any checklist items called out in the review email.\n\nYou can keep the course as a draft or unlisted while iterating.',
		relatedSlugs: ['instructor-payouts', 'instructor-analytics', 'upload-limits'],
		helpfulCount: 360,
		updatedAt: '2026-07-14',
	},
	{
		id: 'faq-instructor-payouts',
		slug: 'instructor-payouts',
		category: 'instructor',
		question: 'When do instructor payouts arrive?',
		excerpt: 'Payout schedules, thresholds, and tax profile requirements.',
		answer:
			'Eligible earnings pay out on a rolling schedule after the refund window clears. Minimum payout thresholds and methods appear under Instructor → Payouts.\n\nComplete your tax profile before the first payout. Failed bank details pause transfers until updated.\n\nStatements list course-level earnings and fees for each period.',
		relatedSlugs: ['publish-course', 'instructor-analytics', 'invoice-receipt'],
		helpfulCount: 505,
		updatedAt: '2026-07-19',
	},
	{
		id: 'faq-instructor-analytics',
		slug: 'instructor-analytics',
		category: 'instructor',
		question: 'Where can I see course analytics?',
		excerpt: 'Enrollment, completion, and revenue insights for instructors.',
		answer:
			'Open Instructor Studio → Analytics for enrollment trends, completion rates, and revenue.\n\nFilter by course and date range. Export CSV when you need deeper spreadsheet analysis.\n\nStudent-level personal data stays limited to protect learner privacy.',
		relatedSlugs: ['publish-course', 'instructor-payouts', 'track-progress'],
		helpfulCount: 278,
		updatedAt: '2026-07-06',
	},
	{
		id: 'faq-what-is-academics',
		slug: 'what-is-academics',
		category: 'general',
		question: 'What is ACADEMICS?',
		excerpt: 'A short overview of the learning marketplace and community.',
		answer:
			'ACADEMICS is a learning marketplace where instructors publish courses and live classes, and learners track progress, earn certificates, and join community spaces.\n\nYou can browse as a guest, but enrollment, community posting, and certificates require an account.\n\nExplore Help Center topics anytime for payments, technical help, and instructor guidance.',
		relatedSlugs: ['join-community', 'course-access', 'contact-support-hours'],
		helpfulCount: 910,
		updatedAt: '2026-07-01',
	},
	{
		id: 'faq-support-hours',
		slug: 'contact-support-hours',
		category: 'general',
		question: 'What are support hours and response times?',
		excerpt: 'When live chat and tickets are typically answered.',
		answer:
			'Live chat runs on business days in major regions. Support requests are answered as quickly as possible, usually within one business day.\n\nUrgent outages related to payments or classroom access are prioritized.\n\nCheck Platform system status on the Help Center for known incidents before opening a ticket.',
		relatedSlugs: ['what-is-academics', 'refund-policy', 'video-wont-play'],
		helpfulCount: 334,
		updatedAt: '2026-07-18',
	},
	{
		id: 'faq-languages',
		slug: 'platform-languages',
		category: 'general',
		question: 'Which languages does the platform support?',
		excerpt: 'Interface languages and course language filters.',
		answer:
			'The ACADEMICS interface supports English and additional locales where available in the language menu.\n\nCourses list their teaching language on the course page—use catalog filters to find your preferred language.\n\nSupport articles are expanding by locale; English remains the most complete knowledge base today.',
		relatedSlugs: ['what-is-academics', 'course-access', 'contact-support-hours'],
		helpfulCount: 198,
		updatedAt: '2026-06-20',
	},
];

export const getFaqBySlug = (slug: string): FaqArticle | null =>
	FAQ_ARTICLES.find((article) => article.slug === slug) ?? null;

export const getFaqsByCategory = (category: FaqCategoryId | 'all'): FaqArticle[] => {
	if (category === 'all') return [...FAQ_ARTICLES];
	return FAQ_ARTICLES.filter((article) => article.category === category);
};

export const getRelatedFaqs = (article: FaqArticle, limit = 3): FaqArticle[] => {
	const related = article.relatedSlugs
		.map((slug) => getFaqBySlug(slug))
		.filter((item): item is FaqArticle => Boolean(item));
	if (related.length >= limit) return related.slice(0, limit);
	const fillers = FAQ_ARTICLES.filter(
		(item) => item.category === article.category && item.slug !== article.slug && !related.some((r) => r.slug === item.slug),
	);
	return [...related, ...fillers].slice(0, limit);
};

export const countFaqsByCategory = (): Record<FaqCategoryId | 'all', number> => {
	const counts = FAQ_CATEGORIES.reduce(
		(acc, category) => {
			acc[category.id] = FAQ_ARTICLES.filter((article) => article.category === category.id).length;
			return acc;
		},
		{ all: FAQ_ARTICLES.length } as Record<FaqCategoryId | 'all', number>,
	);
	return counts;
};

const matchesQuery = (article: FaqArticle, q: string) => {
	if (!q.trim()) return true;
	const hay = `${article.question} ${article.excerpt} ${article.answer} ${article.category}`.toLowerCase();
	return hay.includes(q.trim().toLowerCase());
};

const applyFilter = (articles: FaqArticle[], filter: FaqFilterOption) => {
	if (filter === 'popular') return articles.filter((article) => article.helpfulCount >= 400);
	if (filter === 'recent') {
		const cutoff = new Date('2026-07-01').getTime();
		return articles.filter((article) => new Date(article.updatedAt).getTime() >= cutoff);
	}
	return articles;
};

const applySort = (articles: FaqArticle[], sort: FaqSortOption) => {
	const next = [...articles];
	if (sort === 'az') {
		next.sort((a, b) => a.question.localeCompare(b.question));
		return next;
	}
	if (sort === 'newest') {
		next.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
		return next;
	}
	next.sort((a, b) => b.helpfulCount - a.helpfulCount);
	return next;
};

export const filterAndSortFaqs = (query: FaqListQuery): FaqArticle[] => {
	const base = getFaqsByCategory(query.category).filter((article) => matchesQuery(article, query.q));
	return applySort(applyFilter(base, query.filter), query.sort);
};

export const categoryLabel = (id: FaqCategoryId | 'all') => {
	if (id === 'all') return 'All';
	return FAQ_CATEGORIES.find((category) => category.id === id)?.label ?? id;
};
