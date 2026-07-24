/** FAQ module types (mock / API-ready). */

export type FaqCategoryId =
	| 'account'
	| 'courses'
	| 'payments'
	| 'certificates'
	| 'community'
	| 'technical'
	| 'instructor'
	| 'general';

export type FaqSortOption = 'helpful' | 'newest' | 'az';

export type FaqFilterOption = 'all' | 'popular' | 'recent';

export interface FaqCategory {
	id: FaqCategoryId;
	label: string;
}

export interface FaqArticle {
	id: string;
	slug: string;
	category: FaqCategoryId;
	question: string;
	answer: string;
	excerpt: string;
	relatedSlugs: string[];
	helpfulCount: number;
	updatedAt: string;
}

export interface FaqListQuery {
	q: string;
	category: FaqCategoryId | 'all';
	filter: FaqFilterOption;
	sort: FaqSortOption;
	open?: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
	{ id: 'account', label: 'Account' },
	{ id: 'courses', label: 'Courses' },
	{ id: 'payments', label: 'Payments' },
	{ id: 'certificates', label: 'Certificates' },
	{ id: 'community', label: 'Community' },
	{ id: 'technical', label: 'Technical' },
	{ id: 'instructor', label: 'Instructor' },
	{ id: 'general', label: 'General' },
];

export const FAQ_SORT_OPTIONS: { id: FaqSortOption; label: string }[] = [
	{ id: 'helpful', label: 'Most helpful' },
	{ id: 'newest', label: 'Newest' },
	{ id: 'az', label: 'A–Z' },
];

export const FAQ_FILTER_OPTIONS: { id: FaqFilterOption; label: string }[] = [
	{ id: 'all', label: 'All articles' },
	{ id: 'popular', label: 'Popular' },
	{ id: 'recent', label: 'Recently updated' },
];

export const emptyFaqListQuery = (): FaqListQuery => ({
	q: '',
	category: 'all',
	filter: 'all',
	sort: 'helpful',
});
