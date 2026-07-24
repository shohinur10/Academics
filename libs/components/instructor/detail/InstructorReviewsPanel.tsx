import React from 'react';
import { useTranslation } from 'next-i18next';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { Member } from '../../../types/member/member';
import { getInstructorRatingDistribution, getInstructorReviews } from '../../../mock/instructors.mock';

const Stars = ({ rating }: { rating: number }) => (
	<span className={'stars'} role="img" aria-label={`${rating} out of 5 stars`}>
		{[1, 2, 3, 4, 5].map((i) =>
			i <= Math.round(rating) ? <StarRoundedIcon key={i} /> : <StarBorderRoundedIcon key={i} />,
		)}
	</span>
);

interface InstructorReviewsPanelProps {
	instructor: Member;
}

const InstructorReviewsPanel = ({ instructor }: InstructorReviewsPanelProps) => {
	const { t } = useTranslation('common');
	const reviews = getInstructorReviews(instructor._id);
	const distribution = getInstructorRatingDistribution(instructor);

	const formatDate = (date: Date) =>
		new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

	return (
		<div className={'instructor-reviews-panel'}>
			<div className={'reviews-summary'}>
				<div className={'overall-score'}>
					<strong>{instructor.memberRating?.toFixed(1)}</strong>
					<Stars rating={instructor.memberRating ?? 0} />
					<span>
						{instructor.memberReviewsCount} {t('Reviews')}
					</span>
				</div>
				<div className={'distribution'}>
					{distribution.map((percent, index) => (
						<div key={index} className={'distribution-row'}>
							<span className={'star-label'}>{5 - index}★</span>
							<div className={'bar'} role="img" aria-label={`${5 - index} stars: ${percent}%`}>
								<div className={'bar-fill'} style={{ width: `${percent}%` }} />
							</div>
							<span className={'percent'}>{percent}%</span>
						</div>
					))}
				</div>
			</div>

			<ul className={'reviews-list'}>
				{reviews.map((review) => (
					<li key={review.id} className={'review-card'}>
						<div className={'review-head'}>
							<img src={review.memberAvatar} alt={`${review.memberName} avatar`} loading="lazy" />
							<div className={'review-person'}>
								<strong>{review.memberName}</strong>
								<span className={'review-date'}>{formatDate(review.createdAt)}</span>
							</div>
							<Stars rating={review.rating} />
						</div>
						<p className={'review-text'}>{review.comment}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default InstructorReviewsPanel;
