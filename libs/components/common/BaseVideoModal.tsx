import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { Dialog, IconButton, useMediaQuery } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';

export interface BaseVideoModalProps {
	isOpen: boolean;
	onClose: () => void;
	/** Accessible title id used by aria-labelledby. */
	titleId: string;
	eyebrow: string;
	/** Optional poster shown behind the player or as fallback media. */
	posterUrl?: string;
	/** Video source. When missing, the fallback message is shown instead of a player. */
	videoUrl?: string | null;
	fallbackMessage?: string;
	/** Extra class for domain-specific styling (e.g. course-preview-modal). */
	className?: string;
	children?: React.ReactNode;
}

/**
 * Shared video dialog shell used by CoursePreviewModal and InstructorIntroVideoModal.
 * Mounts the <video> only while open; MUI Dialog provides focus trap, Escape/backdrop
 * close, focus restore, and body scroll lock.
 */
const BaseVideoModal = ({
	isOpen,
	onClose,
	titleId,
	eyebrow,
	posterUrl,
	videoUrl,
	fallbackMessage,
	className,
	children,
}: BaseVideoModalProps) => {
	const { t } = useTranslation('common');
	const fullScreen = useMediaQuery('(max-width:767px)');
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!isOpen) videoRef.current?.pause();
	}, [isOpen]);

	const closeHandler = () => {
		videoRef.current?.pause();
		onClose();
	};

	return (
		<Dialog
			open={isOpen}
			onClose={closeHandler}
			className={`base-video-modal ${className ?? ''}`.trim()}
			maxWidth={false}
			fullScreen={fullScreen}
			aria-labelledby={titleId}
			aria-modal="true"
			keepMounted={false}
		>
			<div className={'preview-inner'}>
				<div className={'preview-head'}>
					<span className={'preview-eyebrow'}>{eyebrow}</span>
					<IconButton className={'preview-close'} aria-label={t('Close preview')} onClick={closeHandler}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>

				<div className={'preview-body'}>
					<div className={'preview-media'}>
						{isOpen && videoUrl ? (
							/* eslint-disable-next-line jsx-a11y/media-has-caption */
							<video
								ref={videoRef}
								controls
								preload="metadata"
								playsInline
								poster={posterUrl}
								src={videoUrl}
							/>
						) : (
							<div className={'video-fallback'}>
								{posterUrl && <img src={posterUrl} alt="" />}
								<div className={'fallback-message'}>
									<OndemandVideoOutlinedIcon />
									<p>{fallbackMessage ?? t('No preview available yet.')}</p>
								</div>
							</div>
						)}
					</div>

					<div className={'preview-details'}>{children}</div>
				</div>
			</div>
		</Dialog>
	);
};

export default BaseVideoModal;
