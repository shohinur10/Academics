/** Help Center / Support presentation types (mock/API-ready). */

export type HelpTopicId =
	| 'account'
	| 'courses'
	| 'payments'
	| 'live'
	| 'certificates'
	| 'technical'
	| 'instructors'
	| 'community';

export type SystemServiceStatus = 'operational' | 'degraded' | 'outage';

export interface HelpTopic {
	id: HelpTopicId;
	title: string;
	description: string;
	articleCount: number;
	href: string;
}

export interface FeaturedFaq {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	helpfulCount: number;
}

export interface HelpAnnouncement {
	id: string;
	slug: string;
	badge: string;
	title: string;
	excerpt: string;
	publishedAt: string;
}

export interface SystemStatusItem {
	id: string;
	name: string;
	status: SystemServiceStatus;
}

export type HelpContactAction = 'chat' | 'request' | 'email' | 'community';

export interface HelpContactOption {
	id: HelpContactAction;
	title: string;
	description: string;
	href: string;
	cta: string;
}

export const HELP_POPULAR_SEARCHES = [
	'Refund',
	'Certificate',
	'Login',
	'Course Access',
	'Live Classes',
] as const;
