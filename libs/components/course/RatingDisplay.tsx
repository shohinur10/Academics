import React from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface RatingDisplayProps {
	rating?: number;
	count?: number;
	/** Optional text after the count, e.g. "Reviews". */
	countSuffix?: string;
}

/** Single-star rating badge shared by course cards, the featured card, the preview modal and the detail hero. */
const RatingDisplay = ({ rating, count, countSuffix }: RatingDisplayProps) => {
	if (rating === undefined) return null;

	return (
		<span className={'rating'}>
			<StarRoundedIcon />
			{rating.toFixed(1)}
			{count !== undefined && (
				<em>
					({count}
					{countSuffix ? ` ${countSuffix}` : ''})
				</em>
			)}
		</span>
	);
};

export default RatingDisplay;
