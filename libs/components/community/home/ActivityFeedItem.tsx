import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { ActivityFeedItemData } from '../../../types/community/community';

interface ActivityFeedItemProps {
	item: ActivityFeedItemData;
}

const ActivityFeedItem = ({ item }: ActivityFeedItemProps) => {
	const { t } = useTranslation('common');
	const href = item.postId ? `/community/posts/${item.postId}` : '/community/groups';

	return (
		<article className={'activity-feed-item'}>
			<img src={item.userAvatar} alt={`${item.userName} avatar`} loading="lazy" className={'activity-avatar'} />
			<div className={'activity-body'}>
				<p className={'activity-meta'}>
					<strong>{item.userName}</strong> {t(item.actionLabel)}
					<span className={'activity-time'}>{item.timeLabel}</span>
				</p>
				<Link href={href} className={'activity-title'}>
					{t(item.title)}
				</Link>
				{item.excerpt ? <p className={'activity-excerpt'}>{item.excerpt}</p> : null}
				<div className={'activity-footer'}>
					<span className={'activity-room'}>{t(item.room)}</span>
					<span>
						<FavoriteBorderOutlinedIcon aria-hidden="true" />
						{item.likes}
					</span>
					<span>
						<ChatBubbleOutlineOutlinedIcon aria-hidden="true" />
						{item.replies}
					</span>
				</div>
			</div>
		</article>
	);
};

export default ActivityFeedItem;
