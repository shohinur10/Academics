import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { SupportTicketMessage } from '../../../types/support/request';

interface MessageProps {
	message: SupportTicketMessage;
}

const formatTimestamp = (iso: string) =>
	new Date(iso).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

const roleLabel = (role: SupportTicketMessage['author']['role'], t: (key: string) => string) => {
	if (role === 'support') return t('Support');
	if (role === 'system') return t('System');
	return t('You');
};

/** Reusable support ticket message bubble. */
const Message = ({ message }: MessageProps) => {
	const { t } = useTranslation('common');
	const avatar = message.author.avatar || '/img/profile/defaultUser.svg';
	const isSupport = message.author.role === 'support';
	const isSystem = message.author.role === 'system';

	return (
		<article
			className={[
				'support-message',
				isSupport ? 'support' : '',
				isSystem ? 'system' : '',
				message.author.role === 'user' ? 'user' : '',
			]
				.filter(Boolean)
				.join(' ')}
			aria-label={`${message.author.name}, ${roleLabel(message.author.role, t)}`}
		>
			{!isSystem ? (
				<span className={'support-message-avatar'}>
					<Image src={avatar} alt="" width={40} height={40} />
				</span>
			) : (
				<span className={'support-message-avatar placeholder'} aria-hidden="true" />
			)}

			<div className={'support-message-body'}>
				<header className={'support-message-meta'}>
					<span className={'support-message-author'}>{t(message.author.name)}</span>
					<span className={`support-message-role role-${message.author.role}`}>
						{roleLabel(message.author.role, t)}
					</span>
					<time dateTime={message.createdAt}>{formatTimestamp(message.createdAt)}</time>
				</header>

				<p className={'support-message-text'}>{t(message.body)}</p>

				{message.attachments.length ? (
					<ul className={'support-message-attachments'}>
						{message.attachments.map((file) => {
							const isImage = file.mimeType.startsWith('image/') && Boolean(file.url);
							return (
								<li key={`${file.name}-${file.size}`}>
									{isImage ? (
										<a
											href={file.url}
											className={'support-attachment-preview image'}
											target="_blank"
											rel="noreferrer"
										>
											<span className={'support-attachment-thumb'}>
												<Image src={file.url!} alt={file.name} width={56} height={56} />
											</span>
											<span>{file.name}</span>
										</a>
									) : (
										<span className={'support-attachment-preview file'}>
											<InsertDriveFileOutlinedIcon fontSize="small" aria-hidden="true" />
											<span>
												{file.name}
												{file.size ? ` · ${Math.max(1, Math.round(file.size / 1024))} KB` : ''}
											</span>
										</span>
									)}
								</li>
							);
						})}
					</ul>
				) : null}
			</div>
		</article>
	);
};

export default Message;
