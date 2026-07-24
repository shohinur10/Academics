import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { validateSupportAttachmentFile } from '../../../support/submitSupportTicket';

interface ReplyFormProps {
	disabled?: boolean;
	busy?: boolean;
	onSubmit: (body: string, file: File | null) => Promise<void>;
}

const ReplyForm = ({ disabled = false, busy = false, onSubmit }: ReplyFormProps) => {
	const { t } = useTranslation('common');
	const fileRef = useRef<HTMLInputElement | null>(null);
	const [body, setBody] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	const clearFile = () => {
		setFile(null);
		if (fileRef.current) fileRef.current.value = '';
	};

	const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const next = event.target.files?.[0] ?? null;
		if (!next) return;
		const typeError = validateSupportAttachmentFile(next);
		if (typeError) {
			setError(typeError);
			clearFile();
			return;
		}
		setError(null);
		setFile(next);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (disabled || busy) return;
		if (!body.trim()) {
			setError(t('Reply cannot be empty.'));
			return;
		}
		setError(null);
		await onSubmit(body.trim(), file);
		setBody('');
		clearFile();
	};

	if (disabled) {
		return (
			<div className={'ticket-reply-disabled'} role="status">
				<p>{t('This ticket is closed. Reopen it to send another reply.')}</p>
			</div>
		);
	}

	return (
		<form className={'ticket-reply-form'} onSubmit={handleSubmit} noValidate>
			<label className={'ticket-reply-label'} htmlFor="ticket-reply-input">
				{t('Your reply')}
			</label>
			<textarea
				id="ticket-reply-input"
				value={body}
				onChange={(event) => setBody(event.target.value)}
				rows={4}
				placeholder={t('Write a reply for the support team…')}
				disabled={busy}
				aria-invalid={Boolean(error)}
			/>

			<div className={'ticket-reply-toolbar'}>
				<div className={'ticket-reply-upload'}>
					<input
						ref={fileRef}
						id="ticket-reply-file"
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
						onChange={onFileChange}
						disabled={busy}
					/>
					<label htmlFor="ticket-reply-file" className={'ticket-upload-btn'}>
						<AttachFileOutlinedIcon fontSize="small" aria-hidden="true" />
						{t('Attach')}
					</label>
					{file ? (
						<span className={'ticket-reply-file-chip'}>
							{file.name}
							<button type="button" onClick={clearFile} aria-label={t('Remove attachment')}>
								<DeleteOutlineRoundedIcon fontSize="small" />
							</button>
						</span>
					) : null}
				</div>
				<button type="submit" className={'ticket-btn primary'} disabled={busy}>
					{busy ? t('Sending…') : t('Send reply')}
				</button>
			</div>
			{error ? (
				<p className={'ticket-reply-error'} role="alert">
					{t(error)}
				</p>
			) : null}
		</form>
	);
};

export default ReplyForm;
