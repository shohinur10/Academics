import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { CommunityAttachment } from '../../../types/community/create';
import { uploadCommunityAttachment } from './uploadCommunityAttachment';

interface AttachmentFieldProps {
	attachments: CommunityAttachment[];
	onChange: (attachments: CommunityAttachment[]) => void;
}

const AttachmentField = ({ attachments, onChange }: AttachmentFieldProps) => {
	const { t } = useTranslation('common');
	const inputRef = useRef<HTMLInputElement>(null);

	const pickFiles = async (files: FileList | null) => {
		if (!files?.length) return;
		let next = [...attachments];
		for (const file of Array.from(files)) {
			const tempId = `tmp-${Date.now()}-${file.name}`;
			next = [
				...next,
				{
					id: tempId,
					name: file.name,
					mimeType: file.type,
					size: file.size,
					progress: 5,
					status: 'uploading',
				},
			];
			onChange([...next]);
			const result = await uploadCommunityAttachment(file, (progress) => {
				next = next.map((item) => (item.id === tempId ? { ...item, progress } : item));
				onChange([...next]);
			});
			next = next.filter((item) => item.id !== tempId).concat(result);
			onChange([...next]);
		}
		if (inputRef.current) inputRef.current.value = '';
	};

	return (
		<div className={'create-attachments'}>
			<div className={'attach-head'}>
				<span className={'field-label'} id="create-attachments-label">
					{t('Attachments')}
				</span>
				<button
					type="button"
					className={'attach-btn'}
					aria-describedby="create-attachments-label"
					onClick={() => inputRef.current?.click()}
				>
					<AttachFileOutlinedIcon />
					{t('Add file')}
				</button>
				<input
					ref={inputRef}
					type="file"
					hidden
					accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
					multiple
					onChange={(e) => void pickFiles(e.target.files)}
				/>
			</div>
			<p className={'attach-hint'}>{t('Images and PDFs only')} · {t('Max 10MB')}</p>
			{attachments.length > 0 ? (
				<ul className={'attach-list'}>
					{attachments.map((file) => (
						<li key={file.id} className={`status-${file.status}`}>
							<div>
								<strong>{file.name}</strong>
								<span>
									{file.status === 'uploading' && `${file.progress}%`}
									{file.status === 'success' && t('Uploaded')}
									{file.status === 'failure' && (file.error || t('Upload failed'))}
								</span>
								{file.status === 'uploading' ? (
									<div className={'progress-bar'} aria-hidden="true">
										<span style={{ width: `${file.progress}%` }} />
									</div>
								) : null}
							</div>
							<button
								type="button"
								aria-label={`${t('Remove')} ${file.name}`}
								onClick={() => onChange(attachments.filter((item) => item.id !== file.id))}
							>
								<DeleteOutlineOutlinedIcon />
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default AttachmentField;
