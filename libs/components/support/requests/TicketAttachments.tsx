import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { SupportTicketAttachmentMeta } from '../../../types/support/contact';

interface TicketAttachmentsProps {
	attachments: SupportTicketAttachmentMeta[];
}

const TicketAttachments = ({ attachments }: TicketAttachmentsProps) => {
	const { t } = useTranslation('common');

	if (!attachments.length) return null;

	return (
		<section className={'ticket-attachments'} aria-labelledby="ticket-attachments-title">
			<h2 id="ticket-attachments-title">{t('Attachments')}</h2>
			<ul>
				{attachments.map((file) => {
					const isImage = file.mimeType.startsWith('image/') && Boolean(file.url);
					return (
						<li key={`${file.name}-${file.size}`}>
							{isImage ? (
								<a href={file.url} className={'ticket-attachment-card'} target="_blank" rel="noreferrer">
									<Image src={file.url!} alt={file.name} width={48} height={48} />
									<span>
										<strong>{file.name}</strong>
										<em>{Math.max(1, Math.round(file.size / 1024))} KB</em>
									</span>
								</a>
							) : (
								<div className={'ticket-attachment-card file'}>
									<span className={'ticket-attachment-icon'} aria-hidden="true">
										<InsertDriveFileOutlinedIcon />
									</span>
									<span>
										<strong>{file.name}</strong>
										<em>
											{file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : t('File')}
										</em>
									</span>
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default TicketAttachments;
