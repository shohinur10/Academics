import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { NoticeArticle } from '../../../types/support/notice';
import { noticeCategoryLabel } from '../../../mock/supportNotices.mock';
import StatusBadge from '../common/StatusBadge';

interface NoticeCardProps {
	notice: NoticeArticle;
	compact?: boolean;
}

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

const categoryTone = (category: NoticeArticle['category']) => {
	switch (category) {
		case 'maintenance':
			return 'maintenance' as const;
		case 'feature':
			return 'feature' as const;
		case 'course':
			return 'course' as const;
		case 'payment':
			return 'payment' as const;
		case 'policy':
			return 'policy' as const;
		default:
			return 'purple' as const;
	}
};

const NoticeCard = ({ notice, compact = false }: NoticeCardProps) => {
	const { t } = useTranslation('common');

	return (
		<article className={compact ? 'notice-card-modern compact' : 'notice-card-modern'}>
			<div className={'notice-card-top'}>
				<StatusBadge label={t(noticeCategoryLabel(notice.category))} tone={categoryTone(notice.category)} />
				{notice.pinned ? (
					<span className={'notice-pinned'} title={t('Pinned')}>
						<PushPinOutlinedIcon fontSize="inherit" aria-hidden="true" />
						{t('Pinned')}
					</span>
				) : null}
			</div>
			<h3 className={'notice-card-title'}>
				<Link href={`/support/notices/${notice.slug}`}>{t(notice.title)}</Link>
			</h3>
			{!compact ? <p className={'notice-card-excerpt'}>{t(notice.excerpt)}</p> : null}
			<div className={'notice-card-footer'}>
				<time dateTime={notice.publishedAt}>{formatDate(notice.publishedAt)}</time>
				<Link href={`/support/notices/${notice.slug}`} className={'notice-card-cta'}>
					{t('View Details')}
				</Link>
			</div>
		</article>
	);
};

export default NoticeCard;
