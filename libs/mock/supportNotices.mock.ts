import {
	NoticeArticle,
	NoticeCategoryId,
	NoticeListQuery,
	NOTICE_CATEGORIES,
	noticeCategoryLabel,
} from '../types/support/notice';

/** Isolated Notice Center mocks until GraphQL notice APIs exist. */

export const NOTICE_ARTICLES: NoticeArticle[] = [
	{
		id: 'notice-maintenance-apr',
		slug: 'scheduled-maintenance-apr',
		category: 'maintenance',
		title: 'Scheduled maintenance window this Sunday',
		excerpt: 'Payments and certificate downloads may pause briefly between 02:00–03:00 KST.',
		body:
			'We will perform scheduled infrastructure maintenance this Sunday from 02:00 to 03:00 KST.\n\nDuring this window, checkout, refunds, and certificate downloads may be temporarily unavailable. Course video playback and community browsing should remain available for most learners.\n\nNo action is required on your side. If a payment is interrupted, wait a few minutes and retry—or check Order History before opening a support ticket.\n\nWe apologize for any inconvenience and appreciate your patience while we improve platform reliability.',
		publishedAt: '2026-07-20',
		pinned: true,
		attachments: [
			{
				id: 'att-maint-status',
				name: 'Maintenance checklist.pdf',
				href: '#',
				sizeLabel: '186 KB',
				type: 'pdf',
			},
		],
		relatedSlugs: ['payment-retry-guidance', 'certificate-download-pause'],
	},
	{
		id: 'notice-live-upgrade',
		slug: 'live-classroom-upgrade',
		category: 'feature',
		title: 'Live classroom quality upgrade',
		excerpt: 'We’ve improved audio stability and waiting-room controls for group sessions.',
		body:
			'Live classroom sessions now include improved audio recovery, clearer waiting-room controls for instructors, and faster join times on supported browsers.\n\nInstructors can admit learners individually or in batches. Learners joining early will see a calmer waiting room with session tips.\n\nNo app update is required. Refresh your browser before your next live class to pick up the latest player.\n\nIf you still experience audio issues, see Help Center → Technical for troubleshooting steps.',
		publishedAt: '2026-07-14',
		pinned: true,
		attachments: [],
		relatedSlugs: ['browser-support-update', 'new-study-group-tools'],
	},
	{
		id: 'notice-community-safety',
		slug: 'community-safety-update',
		category: 'policy',
		title: 'Updated Community & Safety guidelines',
		excerpt: 'Clearer reporting flows and faster review for harassment and spam reports.',
		body:
			'We updated the Community & Safety guidelines to clarify what we remove, how reports are reviewed, and when accounts may be limited.\n\nReporting is available from every post, reply, and profile menu. Priority reports (harassment, threats, or doxxing) are reviewed first.\n\nPlease take a moment to review the guidelines. Continuing to use Community means you agree to the updated standards.\n\nQuestions about a moderation decision can be appealed through Contact Support with the content URL.',
		publishedAt: '2026-07-08',
		pinned: false,
		attachments: [
			{
				id: 'att-safety-guide',
				name: 'Community guidelines summary.pdf',
				href: '#',
				sizeLabel: '242 KB',
				type: 'pdf',
			},
		],
		relatedSlugs: ['new-study-group-tools', 'instructor-content-policy'],
	},
	{
		id: 'notice-payment-retry',
		slug: 'payment-retry-guidance',
		category: 'payment',
		title: 'Guidance if checkout fails during peak hours',
		excerpt: 'Retry tips, order status checks, and when duplicate charges are automatically reversed.',
		body:
			'During high-traffic launches, some card authorizations may fail or take longer to confirm.\n\nIf checkout fails, wait 2–3 minutes, then open Order History before trying again. Duplicate pending authorizations are typically released by your bank within a few business days.\n\nConfirmed payments unlock course access automatically. If access is missing after a successful receipt, contact support with your order ID.\n\nOrganization admins can also check seat assignment status under Billing.',
		publishedAt: '2026-07-18',
		pinned: false,
		attachments: [],
		relatedSlugs: ['scheduled-maintenance-apr', 'invoice-format-update'],
	},
	{
		id: 'notice-invoice-format',
		slug: 'invoice-format-update',
		category: 'payment',
		title: 'Invoice PDF format update',
		excerpt: 'Clearer tax lines and company fields on personal and organization receipts.',
		body:
			'Receipts and invoices downloaded from Order History now show clearer tax breakdowns and company billing fields.\n\nHistorical purchases keep the format that was current at the time of download. Re-download from Orders to get the latest layout when available.\n\nNeed a corrected legal name on an invoice? Contact support within 30 days of purchase.',
		publishedAt: '2026-07-11',
		pinned: false,
		attachments: [
			{
				id: 'att-invoice-sample',
				name: 'Sample invoice.pdf',
				href: '#',
				sizeLabel: '96 KB',
				type: 'pdf',
			},
		],
		relatedSlugs: ['payment-retry-guidance', 'scheduled-maintenance-apr'],
	},
	{
		id: 'notice-course-catalog',
		slug: 'course-catalog-filters',
		category: 'course',
		title: 'Smarter course catalog filters',
		excerpt: 'Filter by level, language, live availability, and certificate eligibility.',
		body:
			'The course catalog now supports richer filters for level, teaching language, live-class availability, and certificate eligibility.\n\nSaved searches are available when you are signed in. Mobile filters open in a bottom sheet for easier tapping.\n\nInstructor-listed prerequisites remain on each course page. Let us know if a filter combination looks incorrect.',
		publishedAt: '2026-07-16',
		pinned: false,
		attachments: [],
		relatedSlugs: ['certificate-download-pause', 'live-classroom-upgrade'],
	},
	{
		id: 'notice-certificate-pause',
		slug: 'certificate-download-pause',
		category: 'course',
		title: 'Temporary certificate download delay resolved',
		excerpt: 'PDF generation is back to normal after last week’s queue backlog.',
		body:
			'Certificate PDF generation briefly queued longer than usual last week. The backlog is cleared and downloads should complete within a few seconds again.\n\nIf a certificate still shows Generating, refresh after a minute or re-open My Certificates.\n\nVerification links were unaffected during the delay.',
		publishedAt: '2026-07-12',
		pinned: false,
		attachments: [],
		relatedSlugs: ['scheduled-maintenance-apr', 'course-catalog-filters'],
	},
	{
		id: 'notice-browser-support',
		slug: 'browser-support-update',
		category: 'feature',
		title: 'Browser support update for learning tools',
		excerpt: 'Internet Explorer remains unsupported; Safari 16+ recommended on macOS.',
		body:
			'ACADEMICS learning tools are tested on the latest two versions of Chrome, Edge, Firefox, and Safari.\n\nInternet Explorer is not supported. On macOS, Safari 16 or newer is recommended for live classes and studio uploads.\n\nUpdate your browser before large live events for the best experience.',
		publishedAt: '2026-07-03',
		pinned: false,
		attachments: [],
		relatedSlugs: ['live-classroom-upgrade', 'new-study-group-tools'],
	},
	{
		id: 'notice-study-groups',
		slug: 'new-study-group-tools',
		category: 'feature',
		title: 'New tools for study group organizers',
		excerpt: 'Pin announcements, approve joins faster, and share resource folders.',
		body:
			'Study group owners can pin announcements, review join requests in bulk, and share a simple resource folder with members.\n\nMembers still follow Community guidelines. Owners can remove posts that break the rules.\n\nOpen Community → Study Groups to try the updates.',
		publishedAt: '2026-07-09',
		pinned: false,
		attachments: [],
		relatedSlugs: ['community-safety-update', 'live-classroom-upgrade'],
	},
	{
		id: 'notice-instructor-policy',
		slug: 'instructor-content-policy',
		category: 'policy',
		title: 'Instructor content quality policy clarification',
		excerpt: 'What reviewers check before marketplace courses go live.',
		body:
			'We clarified the instructor content quality checklist used during course review: accurate titles, working media, clear pricing, and no copyrighted material without rights.\n\nCourses that fail review receive actionable notes in Instructor Studio. You can resubmit after fixes.\n\nThe full checklist is attached for reference.',
		publishedAt: '2026-06-28',
		pinned: false,
		attachments: [
			{
				id: 'att-instructor-checklist',
				name: 'Instructor review checklist.pdf',
				href: '#',
				sizeLabel: '154 KB',
				type: 'pdf',
			},
			{
				id: 'att-instructor-examples',
				name: 'Example syllabus outline.doc',
				href: '#',
				sizeLabel: '48 KB',
				type: 'doc',
			},
		],
		relatedSlugs: ['community-safety-update', 'course-catalog-filters'],
	},
	{
		id: 'notice-payment-methods',
		slug: 'expanded-payment-methods',
		category: 'payment',
		title: 'Expanded payment methods in selected regions',
		excerpt: 'Additional local wallets are rolling out at checkout where available.',
		body:
			'Learners in selected regions may see additional local wallet options at checkout. Availability depends on currency and fraud checks.\n\nCard payments remain available everywhere we operate. Organization invoicing is unchanged.\n\nIf a preferred method is missing, try another browser or contact support with your country and currency.',
		publishedAt: '2026-07-05',
		pinned: false,
		attachments: [],
		relatedSlugs: ['invoice-format-update', 'payment-retry-guidance'],
	},
	{
		id: 'notice-db-maintenance',
		slug: 'database-optimization-notice',
		category: 'maintenance',
		title: 'Brief search latency during database optimization',
		excerpt: 'Catalog and community search may feel slower for up to 20 minutes tonight.',
		body:
			'Tonight we will optimize search indexes. For about 20 minutes around 01:30 KST, course catalog and community search may respond more slowly.\n\nEnrolled course playback should not be affected. If search looks empty, wait a moment and retry.\n\nStatus updates will appear here if the window extends.',
		publishedAt: '2026-07-22',
		pinned: true,
		attachments: [],
		relatedSlugs: ['scheduled-maintenance-apr', 'course-catalog-filters'],
	},
];

export { noticeCategoryLabel, NOTICE_CATEGORIES };

export const getNoticeBySlug = (slug: string): NoticeArticle | null =>
	NOTICE_ARTICLES.find((notice) => notice.slug === slug) ?? null;

export const getRelatedNotices = (notice: NoticeArticle, limit = 3): NoticeArticle[] => {
	const related = notice.relatedSlugs
		.map((slug) => getNoticeBySlug(slug))
		.filter((item): item is NoticeArticle => Boolean(item));
	if (related.length >= limit) return related.slice(0, limit);
	const fillers = NOTICE_ARTICLES.filter(
		(item) =>
			item.category === notice.category &&
			item.slug !== notice.slug &&
			!related.some((entry) => entry.slug === item.slug),
	);
	return [...related, ...fillers].slice(0, limit);
};

/** Chronological neighbors for Previous / Next (newest first index). */
export const getNoticeNeighbors = (slug: string): { prev: NoticeArticle | null; next: NoticeArticle | null } => {
	const ordered = [...NOTICE_ARTICLES].sort((a, b) => {
		if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
		return b.publishedAt.localeCompare(a.publishedAt);
	});
	const index = ordered.findIndex((notice) => notice.slug === slug);
	if (index < 0) return { prev: null, next: null };
	return {
		prev: ordered[index + 1] ?? null,
		next: ordered[index - 1] ?? null,
	};
};

const matchesQuery = (notice: NoticeArticle, q: string) => {
	if (!q.trim()) return true;
	const hay = `${notice.title} ${notice.excerpt} ${notice.body} ${notice.category}`.toLowerCase();
	return hay.includes(q.trim().toLowerCase());
};

export const filterNotices = (query: NoticeListQuery): NoticeArticle[] => {
	const base =
		query.category === 'all'
			? [...NOTICE_ARTICLES]
			: NOTICE_ARTICLES.filter((notice) => notice.category === query.category);

	return base
		.filter((notice) => matchesQuery(notice, query.q))
		.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
			return b.publishedAt.localeCompare(a.publishedAt);
		});
};

export const countNoticesByCategory = (): Record<NoticeCategoryId | 'all', number> => {
	const counts = NOTICE_CATEGORIES.reduce(
		(acc, category) => {
			acc[category.id] = NOTICE_ARTICLES.filter((notice) => notice.category === category.id).length;
			return acc;
		},
		{ all: NOTICE_ARTICLES.length } as Record<NoticeCategoryId | 'all', number>,
	);
	return counts;
};

/** Featured strip for Help Center — keep in sync with pinned / recent notices. */
export const featuredNoticesForHelpCenter = (): NoticeArticle[] =>
	filterNotices({ q: '', category: 'all' }).slice(0, 3);
