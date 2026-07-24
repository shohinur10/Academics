import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface ContactStatusPanelProps {
	variant: 'success' | 'error';
	title: string;
	message: string;
	ticketId?: string;
	onRetry?: () => void;
	onReset?: () => void;
}

const ContactStatusPanel = ({
	variant,
	title,
	message,
	ticketId,
	onRetry,
	onReset,
}: ContactStatusPanelProps) => {
	const { t } = useTranslation('common');

	return (
		<div
			className={variant === 'success' ? 'contact-status success' : 'contact-status error'}
			role={variant === 'error' ? 'alert' : 'status'}
		>
			<span className={'contact-status-icon'} aria-hidden="true">
				{variant === 'success' ? <CheckCircleOutlineRoundedIcon /> : <ErrorOutlineRoundedIcon />}
			</span>
			<h2>{title}</h2>
			<p>{message}</p>
			{ticketId ? (
				<p className={'contact-ticket-id'}>
					{t('Ticket ID')}: <strong>{ticketId}</strong>
				</p>
			) : null}
			<div className={'contact-status-actions'}>
				{variant === 'success' ? (
					<>
						{ticketId ? (
							<Link href={`/support/requests/${ticketId}`} className={'contact-btn primary'}>
								{t('View request')}
							</Link>
						) : (
							<Link href="/support/requests" className={'contact-btn primary'}>
								{t('My Support Requests')}
							</Link>
						)}
						{onReset ? (
							<button type="button" className={'contact-btn ghost'} onClick={onReset}>
								{t('Submit another request')}
							</button>
						) : null}
					</>
				) : (
					<>
						{onRetry ? (
							<button type="button" className={'contact-btn primary'} onClick={onRetry}>
								{t('Try again')}
							</button>
						) : null}
						<Link href="/support/faq" className={'contact-btn ghost'}>
							{t('Browse FAQ')}
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default ContactStatusPanel;
