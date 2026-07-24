import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { NoticeArticle } from '../../../types/support/notice';

interface NoticeAdjacentNavProps {
	prev: NoticeArticle | null;
	next: NoticeArticle | null;
}

const NoticeAdjacentNav = ({ prev, next }: NoticeAdjacentNavProps) => {
	const { t } = useTranslation('common');

	return (
		<nav className={'notice-adjacent'} aria-label={t('Nearby notices')}>
			{prev ? (
				<Link href={`/support/notices/${prev.slug}`} className={'notice-adjacent-link prev'}>
					<span className={'notice-adjacent-label'}>
						<ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
						{t('Previous')}
					</span>
					<span className={'notice-adjacent-title'}>{t(prev.title)}</span>
				</Link>
			) : (
				<span className={'notice-adjacent-link placeholder'} />
			)}
			{next ? (
				<Link href={`/support/notices/${next.slug}`} className={'notice-adjacent-link next'}>
					<span className={'notice-adjacent-label'}>
						{t('Next')}
						<ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" />
					</span>
					<span className={'notice-adjacent-title'}>{t(next.title)}</span>
				</Link>
			) : (
				<span className={'notice-adjacent-link placeholder'} />
			)}
		</nav>
	);
};

export default NoticeAdjacentNav;
