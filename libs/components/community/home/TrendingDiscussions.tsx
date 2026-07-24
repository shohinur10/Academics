import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { TrendingDiscussion } from '../../../types/community/community';

interface TrendingDiscussionsProps {
	items: TrendingDiscussion[];
}

const TrendingDiscussions = ({ items }: TrendingDiscussionsProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'trending-discussions'} aria-labelledby="trending-discussions-title">
			<div className={'section-heading'}>
				<h2 id="trending-discussions-title">{t('Trending Discussions')}</h2>
				<p>{t('Popular conversations happening right now.')}</p>
			</div>
			<div className={'trending-grid'}>
				{items.map((item) => (
					<article key={item.id} className={'trending-card'}>
						<Link href={`/community/posts/${item.id}`} className={'trending-card-link'}>
							<h3>{t(item.title)}</h3>
							<div className={'trending-author'}>
								<img src={item.authorAvatar} alt={`${item.authorName} avatar`} loading="lazy" />
								<span>{item.authorName}</span>
								<em>{t(item.room)}</em>
							</div>
							<div className={'trending-stats'}>
								<span>
									<FavoriteBorderOutlinedIcon aria-hidden="true" />
									{item.reactions}
								</span>
								<span>
									<ChatBubbleOutlineOutlinedIcon aria-hidden="true" />
									{item.replies}
								</span>
								<span>
									<VisibilityOutlinedIcon aria-hidden="true" />
									{item.views.toLocaleString()}
								</span>
								<time dateTime={item.lastActivityLabel}>{item.lastActivityLabel}</time>
							</div>
						</Link>
					</article>
				))}
			</div>
		</section>
	);
};

export default TrendingDiscussions;
