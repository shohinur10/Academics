import React from 'react';
import { useTranslation } from 'next-i18next';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Member, InstructorVideoItem } from '../../../types/member/member';

interface InstructorVideosProps {
	instructor: Member;
	onPlay: (video: InstructorVideoItem) => void;
}

const InstructorVideos = ({ instructor, onPlay }: InstructorVideosProps) => {
	const { t } = useTranslation('common');
	const videos = instructor.memberVideos ?? [];

	if (!videos.length) return null;

	return (
		<ul className={'instructor-videos-grid'}>
			{videos.map((video) => (
				<li key={video.id}>
					<button
						type="button"
						className={'video-card'}
						aria-label={`${t('Play')}: ${video.title}`}
						onClick={() => onPlay(video)}
					>
						<img src={video.posterUrl} alt="" loading="lazy" />
						<span className={'video-overlay'} aria-hidden="true" />
						<span className={'video-play'} aria-hidden="true">
							<PlayArrowRoundedIcon />
						</span>
						<span className={'video-duration'}>{video.duration}</span>
						<span className={'video-title'}>{t(video.title)}</span>
					</button>
				</li>
			))}
		</ul>
	);
};

export default InstructorVideos;
