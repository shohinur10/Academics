import React from 'react';
import { useTranslation } from 'next-i18next';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { NoticeAttachment } from '../../../types/support/notice';

interface NoticeAttachmentsProps {
	attachments: NoticeAttachment[];
}

const iconFor = (type: NoticeAttachment['type']) => {
	switch (type) {
		case 'pdf':
			return <PictureAsPdfOutlinedIcon fontSize="small" aria-hidden="true" />;
		case 'doc':
			return <DescriptionOutlinedIcon fontSize="small" aria-hidden="true" />;
		case 'image':
			return <ImageOutlinedIcon fontSize="small" aria-hidden="true" />;
		case 'link':
			return <LinkOutlinedIcon fontSize="small" aria-hidden="true" />;
		default:
			return <AttachFileOutlinedIcon fontSize="small" aria-hidden="true" />;
	}
};

const NoticeAttachments = ({ attachments }: NoticeAttachmentsProps) => {
	const { t } = useTranslation('common');

	if (!attachments.length) return null;

	return (
		<section className={'notice-attachments'} aria-labelledby="notice-attachments-title">
			<h2 id="notice-attachments-title">{t('Attachments')}</h2>
			<ul>
				{attachments.map((file) => (
					<li key={file.id}>
						<a
							href={file.href === '#' ? undefined : file.href}
							className={'notice-attachment-link'}
							download={file.href !== '#' ? true : undefined}
							onClick={file.href === '#' ? (event) => event.preventDefault() : undefined}
							aria-disabled={file.href === '#'}
						>
							<span className={'notice-attachment-icon'}>{iconFor(file.type)}</span>
							<span className={'notice-attachment-copy'}>
								<span className={'notice-attachment-name'}>{file.name}</span>
								<span className={'notice-attachment-size'}>{file.sizeLabel}</span>
							</span>
						</a>
					</li>
				))}
			</ul>
			{attachments.some((file) => file.href === '#') ? (
				<p className={'notice-attachment-note'}>{t('Attachment downloads will connect when files are published.')}</p>
			) : null}
		</section>
	);
};

export default NoticeAttachments;
