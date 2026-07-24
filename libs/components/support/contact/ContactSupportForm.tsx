import React, { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
	SUPPORT_TICKET_CATEGORIES,
	SUPPORT_TICKET_PRIORITIES,
	SupportTicketFieldErrors,
	SupportTicketInput,
	SupportTicketResult,
	SupportTicketSubmitStatus,
	emptySupportTicketInput,
	estimatedResponseFor,
} from '../../../types/support/contact';
import {
	submitSupportTicket,
	uploadSupportAttachment,
	validateSupportAttachmentFile,
	validateSupportTicket,
} from '../../../support/submitSupportTicket';
import ContactStatusPanel from './ContactStatusPanel';

export interface ContactCourseOption {
	id: string;
	title: string;
}

interface ContactSupportFormProps {
	courses: ContactCourseOption[];
	coursesLoading?: boolean;
	onPriorityChange?: (priority: SupportTicketInput['priority']) => void;
}

const ContactSupportForm = ({
	courses,
	coursesLoading = false,
	onPriorityChange,
}: ContactSupportFormProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const channel = typeof router.query.channel === 'string' ? router.query.channel : 'request';

	const [form, setForm] = useState<SupportTicketInput>(() => ({
		...emptySupportTicketInput(),
		channel,
	}));
	const [fieldErrors, setFieldErrors] = useState<SupportTicketFieldErrors>({});
	const [status, setStatus] = useState<SupportTicketSubmitStatus>('idle');
	const [result, setResult] = useState<SupportTicketResult | null>(null);
	const [uploading, setUploading] = useState(false);

	const eta = useMemo(() => estimatedResponseFor(form.priority), [form.priority]);

	const patch = (partial: Partial<SupportTicketInput>) => {
		setForm((prev) => ({ ...prev, ...partial }));
	};

	const clearAttachment = () => {
		patch({ attachment: null });
		setFieldErrors((prev) => {
			const next = { ...prev };
			delete next.attachment;
			return next;
		});
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const localError = validateSupportAttachmentFile(file);
		if (localError) {
			setFieldErrors((prev) => ({ ...prev, attachment: localError }));
			event.target.value = '';
			return;
		}

		setUploading(true);
		setFieldErrors((prev) => {
			const next = { ...prev };
			delete next.attachment;
			return next;
		});

		try {
			const uploaded = await uploadSupportAttachment(file);
			patch({ attachment: uploaded });
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : t('Attachment upload failed.');
			setFieldErrors((prev) => ({ ...prev, attachment: message }));
			patch({ attachment: null });
			if (fileInputRef.current) fileInputRef.current.value = '';
		} finally {
			setUploading(false);
		}
	};

	const resetForm = () => {
		setForm({ ...emptySupportTicketInput(), channel });
		setFieldErrors({});
		setStatus('idle');
		setResult(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const onCancel = () => {
		void router.push('/cs');
	};

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const errors = validateSupportTicket(form);
		if (fieldErrors.attachment) errors.attachment = fieldErrors.attachment;
		setFieldErrors(errors);
		if (Object.keys(errors).length) {
			setStatus('error');
			setResult({
				ok: false,
				code: 'VALIDATION',
				message: t('Please fix the highlighted fields.'),
				fieldErrors: errors,
			});
			return;
		}

		setStatus('loading');
		setResult(null);

		const response = await submitSupportTicket({ ...form, channel });
		setResult(response);
		setStatus(response.ok ? 'success' : 'error');
		if (!response.ok && response.fieldErrors) {
			setFieldErrors(response.fieldErrors);
		}
	};

	if (status === 'success' && result?.ok) {
		return (
			<ContactStatusPanel
				variant="success"
				title={t('Request submitted')}
				message={t(result.message)}
				ticketId={result.ticketId}
				onReset={resetForm}
			/>
		);
	}

	return (
		<div className={'contact-form-shell'}>
			{status === 'error' && result && result.code !== 'VALIDATION' ? (
				<ContactStatusPanel
					variant="error"
					title={t('Could not submit request')}
					message={t(result.message)}
					onRetry={() => {
						setStatus('idle');
						setResult(null);
					}}
				/>
			) : null}

			<form className={'contact-form'} onSubmit={onSubmit} noValidate>
				<div className={'contact-form-grid'}>
					<label className={fieldErrors.category ? 'contact-field error' : 'contact-field'}>
						<span>
							{t('Category')} <abbr title={t('required')}>*</abbr>
						</span>
						<select
							value={form.category}
							onChange={(event) =>
								patch({ category: event.target.value as SupportTicketInput['category'] })
							}
							aria-invalid={Boolean(fieldErrors.category)}
							aria-describedby={fieldErrors.category ? 'contact-category-error' : undefined}
							disabled={status === 'loading'}
						>
							<option value="">{t('Select a category')}</option>
							{SUPPORT_TICKET_CATEGORIES.map((category) => (
								<option key={category.id} value={category.id}>
									{t(category.label)}
								</option>
							))}
						</select>
						{fieldErrors.category ? (
							<span id="contact-category-error" className={'contact-field-error'}>
								{t(fieldErrors.category)}
							</span>
						) : null}
					</label>

					<label className={fieldErrors.priority ? 'contact-field error' : 'contact-field'}>
						<span>
							{t('Priority')} <abbr title={t('required')}>*</abbr>
						</span>
						<select
							value={form.priority}
							onChange={(event) => {
								const priority = event.target.value as SupportTicketInput['priority'];
								patch({ priority });
								onPriorityChange?.(priority);
							}}
							aria-invalid={Boolean(fieldErrors.priority)}
							aria-describedby={fieldErrors.priority ? 'contact-priority-error' : undefined}
							disabled={status === 'loading'}
						>
							{SUPPORT_TICKET_PRIORITIES.map((priority) => (
								<option key={priority.id} value={priority.id}>
									{t(priority.label)} — {t(priority.eta)}
								</option>
							))}
						</select>
						{fieldErrors.priority ? (
							<span id="contact-priority-error" className={'contact-field-error'}>
								{t(fieldErrors.priority)}
							</span>
						) : null}
					</label>
				</div>

				<label className={fieldErrors.subject ? 'contact-field error' : 'contact-field'}>
					<span>
						{t('Subject')} <abbr title={t('required')}>*</abbr>
					</span>
					<input
						type="text"
						value={form.subject}
						onChange={(event) => patch({ subject: event.target.value })}
						placeholder={t('Brief summary of your issue')}
						maxLength={120}
						aria-invalid={Boolean(fieldErrors.subject)}
						aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
						disabled={status === 'loading'}
					/>
					{fieldErrors.subject ? (
						<span id="contact-subject-error" className={'contact-field-error'}>
							{t(fieldErrors.subject)}
						</span>
					) : null}
				</label>

				<label className={'contact-field'}>
					<span>{t('Related Course')}</span>
					<select
						value={form.relatedCourseId}
						onChange={(event) => {
							const id = event.target.value;
							const course = courses.find((item) => item.id === id);
							patch({
								relatedCourseId: id,
								relatedCourseTitle: course?.title ?? '',
							});
						}}
						disabled={status === 'loading' || coursesLoading}
					>
						<option value="">{t('None / not course-related')}</option>
						{courses.map((course) => (
							<option key={course.id} value={course.id}>
								{course.title}
							</option>
						))}
					</select>
				</label>

				<label className={fieldErrors.description ? 'contact-field error' : 'contact-field'}>
					<span>
						{t('Description')} <abbr title={t('required')}>*</abbr>
					</span>
					<textarea
						value={form.description}
						onChange={(event) => patch({ description: event.target.value })}
						placeholder={t('Describe what happened, what you expected, and any error messages.')}
						rows={7}
						aria-invalid={Boolean(fieldErrors.description)}
						aria-describedby={
							fieldErrors.description ? 'contact-description-error' : 'contact-description-hint'
						}
						disabled={status === 'loading'}
					/>
					{fieldErrors.description ? (
						<span id="contact-description-error" className={'contact-field-error'}>
							{t(fieldErrors.description)}
						</span>
					) : (
						<span id="contact-description-hint" className={'contact-field-hint'}>
							{t('Estimated reply')}: {t(eta)}
						</span>
					)}
				</label>

				<div className={fieldErrors.attachment ? 'contact-field error' : 'contact-field'}>
					<span>{t('Attachment')}</span>
					<div className={'contact-upload'}>
						<input
							ref={fileInputRef}
							id="contact-attachment"
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
							onChange={onFileChange}
							disabled={status === 'loading' || uploading}
						/>
						<label htmlFor="contact-attachment" className={'contact-upload-btn'}>
							<AttachFileOutlinedIcon fontSize="small" aria-hidden="true" />
							{uploading ? t('Uploading…') : t('Choose file')}
						</label>
						<span className={'contact-field-hint'}>{t('JPG, PNG, WEBP, GIF, or PDF · max 10MB')}</span>
					</div>
					{form.attachment ? (
						<div className={'contact-attachment-chip'}>
							<span>
								{form.attachment.name}
								{form.attachment.url ? ` · ${t('Uploaded')}` : ''}
							</span>
							<button type="button" onClick={clearAttachment} aria-label={t('Remove attachment')}>
								<DeleteOutlineRoundedIcon fontSize="small" />
							</button>
						</div>
					) : null}
					{fieldErrors.attachment ? (
						<span className={'contact-field-error'}>{t(fieldErrors.attachment)}</span>
					) : null}
				</div>

				<div className={'contact-form-actions'}>
					<button type="submit" className={'contact-btn primary'} disabled={status === 'loading' || uploading}>
						{status === 'loading' ? t('Submitting…') : t('Submit')}
					</button>
					<button
						type="button"
						className={'contact-btn ghost'}
						onClick={onCancel}
						disabled={status === 'loading'}
					>
						{t('Cancel')}
					</button>
					<Link href="/support/requests" className={'contact-requests-link'}>
						{t('My Support Requests')}
					</Link>
				</div>
			</form>
		</div>
	);
};

export default ContactSupportForm;
