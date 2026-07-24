/** Notice Center types (mock / API-ready). */

export type NoticeCategoryId =
	| 'maintenance'
	| 'feature'
	| 'course'
	| 'payment'
	| 'policy';

export interface NoticeCategory {
	id: NoticeCategoryId;
	label: string;
}

export interface NoticeAttachment {
	id: string;
	name: string;
	href: string;
	sizeLabel: string;
	type: 'pdf' | 'image' | 'doc' | 'link';
}

export interface NoticeArticle {
	id: string;
	slug: string;
	category: NoticeCategoryId;
	title: string;
	excerpt: string;
	body: string;
	publishedAt: string;
	pinned: boolean;
	attachments: NoticeAttachment[];
	relatedSlugs: string[];
}

export interface NoticeListQuery {
	q: string;
	category: NoticeCategoryId | 'all';
}

export const NOTICE_CATEGORIES: NoticeCategory[] = [
	{ id: 'maintenance', label: 'Maintenance' },
	{ id: 'feature', label: 'Feature' },
	{ id: 'course', label: 'Course' },
	{ id: 'payment', label: 'Payment' },
	{ id: 'policy', label: 'Policy' },
];

export const emptyNoticeListQuery = (): NoticeListQuery => ({
	q: '',
	category: 'all',
});

export const noticeCategoryLabel = (id: NoticeCategoryId | 'all') => {
	if (id === 'all') return 'All';
	return NOTICE_CATEGORIES.find((category) => category.id === id)?.label ?? id;
};
