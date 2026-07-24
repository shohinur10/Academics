import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import { Member, InstructorVideoItem } from '../../../types/member/member';
import BaseVideoModal from '../../common/BaseVideoModal';

export interface InstructorIntroVideoModalProps {
	isOpen: boolean;
	instructor: Member | null;
	video?: InstructorVideoItem | null;
	onClose: () => void;
}

/**
 * Instructor intro / sample video modal — domain wrapper around BaseVideoModal.
 */
const InstructorIntroVideoModal = ({ isOpen, instructor, video = null, onClose }: InstructorIntroVideoModalProps) => {
	const { t } = useTranslation('common');

	if (!instructor) return null;

	const activeVideo =
		video ??
		instructor.memberVideos?.[0] ??
		(instructor.memberIntroVideoUrl
			? {
					id: `${instructor._id}-intro`,
					title: 'Introduction',
					duration: '1:45',
					posterUrl: instructor.memberImage || '/img/profile/defaultUser.svg',
					videoUrl: instructor.memberIntroVideoUrl,
			  }
			: null);

	const portrait = instructor.memberImage || '/img/profile/defaultUser.svg';
	const poster = activeVideo?.posterUrl || portrait;
	const profileHref = { pathname: '/instructor/detail', query: { id: instructor._id } };
	const coursesHref = {
		pathname: '/course',
		query: {
			input: JSON.stringify({ page: 1, limit: 8, search: { text: instructor.memberNick } }),
		},
	};

	return (
		<BaseVideoModal
			isOpen={isOpen}
			onClose={onClose}
			titleId="instructor-intro-title"
			eyebrow={t('Instructor Video')}
			posterUrl={poster}
			videoUrl={activeVideo?.videoUrl}
			fallbackMessage={t('No intro video available for this instructor yet.')}
			className="instructor-intro-modal"
		>
			<span className={'preview-video-label'}>{activeVideo ? t(activeVideo.title) : t('Instructor Video')}</span>

			<h2 id="instructor-intro-title" className={'preview-title'}>
				{instructor.memberNick}
			</h2>

			<div className={'preview-instructor'}>
				<img src={portrait} alt={`${instructor.memberNick} avatar`} />
				<div className={'preview-instructor-meta'}>
					<span>{instructor.memberNick}</span>
					<em>{instructor.memberTitle}</em>
				</div>
			</div>

			{instructor.memberLanguages?.length ? (
				<div className={'preview-chips'}>
					<span className={'chip'}>
						<TranslateOutlinedIcon />
						{instructor.memberLanguages.join(' · ')}
					</span>
				</div>
			) : null}

			{instructor.memberExpertise?.length ? (
				<ul className={'preview-tags'}>
					{instructor.memberExpertise.map((tag) => (
						<li key={tag}>{t(tag)}</li>
					))}
				</ul>
			) : null}

			{instructor.memberDesc && <p className={'preview-desc'}>{instructor.memberDesc}</p>}

			<div className={'preview-actions'}>
				<Link href={profileHref} className={'view-course-btn'} onClick={onClose}>
					{t('View Profile')}
				</Link>
				<Link href={coursesHref} className={'enroll-btn'} onClick={onClose}>
					{t('View Courses')}
				</Link>
			</div>
		</BaseVideoModal>
	);
};

export default InstructorIntroVideoModal;
