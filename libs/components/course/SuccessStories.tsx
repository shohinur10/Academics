import React from 'react';
import { useTranslation } from 'next-i18next';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';

interface Story {
	name: string;
	photo: string;
	quote: string;
	course: string;
	improvement: string;
}

/** Placeholder testimonials + photos until real student stories are collected. */
const STORIES: Story[] = [
	{
		name: 'Minji Lee',
		photo: '/img/profile/girl.svg',
		quote: 'The IELTS writing feedback was incredibly detailed. I finally understood exactly what examiners look for.',
		course: 'IELTS Writing Band 7+ Masterclass',
		improvement: 'Band 6.0 → 7.5 in 8 weeks',
	},
	{
		name: 'Daniel Park',
		photo: '/img/profile/agent.png',
		quote: 'Weekly live conversation sessions gave me the confidence to speak Korean naturally at work.',
		course: 'Korean Conversation Club',
		improvement: 'From hesitant to fluent daily conversations',
	},
	{
		name: 'Ayan Karimov',
		photo: '/img/profile/agent.png',
		quote: 'The TOEIC strategies were pure gold. Timed practice sets felt exactly like the real exam.',
		course: 'TOEIC Listening & Reading 900+',
		improvement: 'Score 720 → 935 in one term',
	},
];

const SuccessStories = () => {
	const { t } = useTranslation('common');

	return (
		<section className={'success-stories'} aria-labelledby="success-stories-title">
			<div className={'section-head centered'}>
				<h2 id="success-stories-title">{t('Student Success Stories')}</h2>
				<p>{t('Real results from students who learned with Academics.')}</p>
			</div>
			<div className={'stories-row'}>
				{STORIES.map((story) => (
					<article key={story.name} className={'story-card'}>
						<FormatQuoteRoundedIcon className={'quote-icon'} aria-hidden="true" />
						<p className={'story-quote'}>{story.quote}</p>
						<div className={'story-footer'}>
							<img src={story.photo} alt={`${story.name} photo`} loading="lazy" />
							<div className={'story-person'}>
								<strong>{story.name}</strong>
								<span>{story.course}</span>
							</div>
						</div>
						<span className={'story-improvement'}>{story.improvement}</span>
					</article>
				))}
			</div>
		</section>
	);
};

export default SuccessStories;
