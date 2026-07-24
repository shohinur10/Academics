import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import {
	Dialog,
	FormControl,
	FormControlLabel,
	IconButton,
	MenuItem,
	Select,
	Switch,
	useMediaQuery,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { createContentModalVar, closeCreateContentModal } from './createContentModalState';
import {
	CommunityContentType,
	CommunityCreateFormState,
	CommunityPollDuration,
	CommunityResourceType,
	createEmptyForm,
} from '../../../types/community/create';
import { COMMUNITY_ROOMS } from '../../../mock/community.mock';
import { createCommunityPost } from '../../../mock/communityPosts.store';
import { userVar } from '../../../../apollo/store';
import { MemberType } from '../../../enums/member.enum';
import { REACT_APP_API_URL } from '../../../config';
import { CommunityPostRole } from '../../../types/community/post';
import TagInput from './TagInput';
import AttachmentField from './AttachmentField';

const resolveAvatar = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const mapRole = (memberType?: string): CommunityPostRole => {
	if (memberType === MemberType.ADMIN) return 'ADMIN';
	if (memberType === MemberType.INSTRUCTOR) return 'INSTRUCTOR';
	return 'STUDENT';
};

const TYPE_CARDS: {
	id: CommunityContentType;
	title: string;
	description: string;
	icon: React.ReactNode;
}[] = [
	{
		id: 'discussion',
		title: 'Discussion',
		description: 'Start a conversation with the community.',
		icon: <ForumOutlinedIcon />,
	},
	{
		id: 'question',
		title: 'Question',
		description: 'Ask for help and get answers from learners and instructors.',
		icon: <HelpOutlineOutlinedIcon />,
	},
	{
		id: 'poll',
		title: 'Poll',
		description: 'Collect quick opinions with multiple options.',
		icon: <PollOutlinedIcon />,
	},
	{
		id: 'resource',
		title: 'Resource',
		description: 'Share a PDF, video, website, or study notes.',
		icon: <MenuBookOutlinedIcon />,
	},
	{
		id: 'success',
		title: 'Success Story',
		description: 'Celebrate a milestone and inspire others.',
		icon: <EmojiEventsOutlinedIcon />,
	},
];

const RESOURCE_TYPES: CommunityResourceType[] = [
	'PDF',
	'Video',
	'Website',
	'Flashcards',
	'Notes',
	'Vocabulary List',
];

const POLL_DURATIONS: { value: CommunityPollDuration; label: string }[] = [
	{ value: '1d', label: '1 day' },
	{ value: '3d', label: '3 days' },
	{ value: '7d', label: '7 days' },
	{ value: '14d', label: '14 days' },
	{ value: '30d', label: '30 days' },
];

const CreateCommunityContentModal = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const modal = useReactiveVar(createContentModalVar);
	const user = useReactiveVar(userVar);
	const fullScreen = useMediaQuery('(max-width:767px)');
	const titleId = useId();
	const errorSummaryRef = useRef<HTMLDivElement>(null);
	const submittingRef = useRef(false);

	const [form, setForm] = useState<CommunityCreateFormState>(createEmptyForm());
	const [errors, setErrors] = useState<string[]>([]);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(true);

	useEffect(() => {
		if (!modal.open) return;
		const next = createEmptyForm(modal.initialType);
		if (modal.initialDraft) next.body = modal.initialDraft;
		setForm(next);
		setErrors([]);
		setFieldErrors({});
		setSubmitting(false);
		submittingRef.current = false;
	}, [modal.open, modal.initialType, modal.initialDraft]);

	const dirty = useMemo(() => {
		const empty = createEmptyForm(form.type);
		return (
			form.title !== empty.title ||
			form.body !== empty.body ||
			form.tags.length > 0 ||
			form.attachments.length > 0 ||
			form.pollOptions.some((o) => o.trim()) ||
			Boolean(form.resourceUrl.trim()) ||
			Boolean(form.goal.trim()) ||
			Boolean(form.result.trim())
		);
	}, [form]);

	const patch = (partial: Partial<CommunityCreateFormState>) => setForm((prev) => ({ ...prev, ...partial }));

	const validate = (): boolean => {
		const nextErrors: string[] = [];
		const nextFields: Record<string, string> = {};

		if (form.type === 'poll') {
			if (!form.title.trim()) {
				nextFields.title = t('Question is required');
				nextErrors.push(t('Question is required'));
			}
		} else if (!form.title.trim()) {
			nextFields.title = t('Title is required');
			nextErrors.push(t('Title is required'));
		}

		if (!form.body.trim() && form.type !== 'poll') {
			nextFields.body = t('Body is required');
			nextErrors.push(t('Body is required'));
		}
		if (form.type === 'poll' && !form.body.trim()) {
			/* body optional for poll; question is title */
		}

		if (!form.roomSlug) {
			nextFields.roomSlug = t('Select a room');
			nextErrors.push(t('Select a room'));
		}

		if (form.type === 'poll') {
			const options = form.pollOptions.map((o) => o.trim());
			const filled = options.filter(Boolean);
			if (filled.length < 2) {
				nextFields.pollOptions = t('Poll requires at least 2 options.');
				nextErrors.push(t('Poll requires at least 2 options.'));
			}
			const lower = filled.map((o) => o.toLowerCase());
			if (new Set(lower).size !== lower.length) {
				nextFields.pollOptions = t('Poll options must be unique.');
				nextErrors.push(t('Poll options must be unique.'));
			}
			if (options.some((o) => !o)) {
				nextFields.pollOptions = t('Poll options cannot be blank.');
				nextErrors.push(t('Poll options cannot be blank.'));
			}
		}

		if (form.type === 'resource') {
			const hasUrl = Boolean(form.resourceUrl.trim());
			const hasFile = form.attachments.some((a) => a.status === 'success');
			if (!hasUrl && !hasFile) {
				nextFields.resourceUrl = t('Add a resource URL or attachment.');
				nextErrors.push(t('Add a resource URL or attachment.'));
			}
		}

		if (form.type === 'success') {
			if (!form.goal.trim()) {
				nextFields.goal = t('Goal is required');
				nextErrors.push(t('Goal is required'));
			}
			if (!form.result.trim()) {
				nextFields.result = t('Result is required');
				nextErrors.push(t('Result is required'));
			}
		}

		if (form.attachments.some((a) => a.status === 'uploading')) {
			nextErrors.push(t('Wait for uploads to finish.'));
		}
		if (form.attachments.some((a) => a.status === 'failure')) {
			nextErrors.push(t('Remove failed attachments before publishing.'));
		}

		setFieldErrors(nextFields);
		setErrors(nextErrors);
		if (nextErrors.length) {
			requestAnimationFrame(() => errorSummaryRef.current?.focus());
			return false;
		}
		return true;
	};

	const requestClose = () => {
		if (submitting) return;
		if (dirty) {
			const confirmed = window.confirm(t('Discard unsaved changes?'));
			if (!confirmed) return;
		}
		closeCreateContentModal();
	};

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (submittingRef.current) return;
		if (!validate()) return;
		submittingRef.current = true;
		setSubmitting(true);
		setErrors([]);
		try {
			if (!user?._id) {
				setErrors([t('Sign in to publish community content.')]);
				errorSummaryRef.current?.focus();
				return;
			}
			const result = await createCommunityPost(form, {
				id: user._id,
				name: user.memberNick || 'You',
				avatar: resolveAvatar(user.memberImage),
				role: mapRole(user.memberType),
			});
			if (!result.ok) {
				setErrors([t(result.error)]);
				errorSummaryRef.current?.focus();
				return;
			}
			closeCreateContentModal();
			if (result.data) {
				await router.push(`/community/posts/${result.data.slug}`);
			}
		} catch (err) {
			setErrors([err instanceof Error ? err.message : t('Something went wrong. Please try again.')]);
			errorSummaryRef.current?.focus();
		} finally {
			submittingRef.current = false;
			setSubmitting(false);
		}
	};

	const showPreview = form.type === 'poll' || form.type === 'resource';

	return (
		<Dialog
			open={modal.open}
			onClose={(_, reason) => {
				if (reason === 'backdropClick' && dirty) {
					requestClose();
					return;
				}
				if (reason === 'escapeKeyDown') {
					requestClose();
					return;
				}
				requestClose();
			}}
			fullScreen={fullScreen}
			maxWidth={false}
			className={'create-community-modal'}
			aria-labelledby={titleId}
			aria-modal="true"
		>
			<div className={'create-modal-inner'}>
				<header className={'create-modal-head'}>
					<div>
						<p className={'eyebrow'}>{t('Create')}</p>
						<h2 id={titleId}>{t('Create community content')}</h2>
					</div>
					<IconButton aria-label={t('Close')} onClick={requestClose}>
						<CloseOutlinedIcon />
					</IconButton>
				</header>

				<form className={'create-modal-form'} onSubmit={onSubmit} noValidate>
					{errors.length > 0 ? (
						<div className={'error-summary'} ref={errorSummaryRef} tabIndex={-1} role="alert">
							<strong>{t('Please fix the following:')}</strong>
							<ul>
								{errors.map((error) => (
									<li key={error}>{error}</li>
								))}
							</ul>
						</div>
					) : null}

					<fieldset className={'type-picker'}>
						<legend>{t('Content type')}</legend>
						<div className={'type-grid'} role="radiogroup" aria-label={t('Content type')}>
							{TYPE_CARDS.map((card) => {
								const selected = form.type === card.id;
								return (
									<button
										key={card.id}
										type="button"
										role="radio"
										aria-checked={selected}
										className={`type-card ${selected ? 'selected' : ''}`}
										onClick={() => patch({ type: card.id })}
									>
										<span className={'type-icon'} aria-hidden="true">
											{card.icon}
										</span>
										<strong>{t(card.title)}</strong>
										<em>{t(card.description)}</em>
									</button>
								);
							})}
						</div>
					</fieldset>

					<div className={`create-layout ${showPreview ? 'with-preview' : ''}`}>
						<div className={'create-fields'}>
							<div className={'field'}>
								<label htmlFor="create-title">
									{form.type === 'poll' ? t('Poll question') : t('Title')}
								</label>
								<input
									id="create-title"
									value={form.title}
									aria-invalid={Boolean(fieldErrors.title)}
									onChange={(e) => patch({ title: e.target.value })}
								/>
								{fieldErrors.title ? <span className={'field-error'}>{fieldErrors.title}</span> : null}
							</div>

							<div className={'field'}>
								<label htmlFor="create-body">
									{form.type === 'question'
										? t('Detailed question')
										: form.type === 'success'
											? t('Story')
											: form.type === 'poll'
												? t('Description (optional)')
												: t('Body')}
								</label>
								<textarea
									id="create-body"
									rows={6}
									value={form.body}
									aria-invalid={Boolean(fieldErrors.body)}
									onChange={(e) => patch({ body: e.target.value })}
								/>
								{fieldErrors.body ? <span className={'field-error'}>{fieldErrors.body}</span> : null}
							</div>

							<div className={'field'}>
								<label htmlFor="create-room">{t('Room')}</label>
								<FormControl fullWidth size="small">
									<Select
										id="create-room"
										value={form.roomSlug}
										onChange={(e) => patch({ roomSlug: e.target.value })}
									>
										{COMMUNITY_ROOMS.map((room) => (
											<MenuItem key={room.slug} value={room.slug}>
												{t(room.name)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>

							<TagInput value={form.tags} onChange={(tags) => patch({ tags })} />

							{form.type === 'question' ? (
								<div className={'field-row'}>
									<div className={'field'}>
										<label htmlFor="related-course">{t('Related course (optional)')}</label>
										<input
											id="related-course"
											value={form.relatedCourseId}
											placeholder={t('Course name or ID')}
											onChange={(e) => patch({ relatedCourseId: e.target.value })}
										/>
									</div>
									<div className={'field'}>
										<label htmlFor="related-instructor">{t('Related instructor (optional)')}</label>
										<input
											id="related-instructor"
											value={form.relatedInstructorId}
											placeholder={t('Instructor name or ID')}
											onChange={(e) => patch({ relatedInstructorId: e.target.value })}
										/>
									</div>
								</div>
							) : null}

							{form.type === 'poll' ? (
								<div className={'poll-builder'}>
									<span className={'field-label'}>{t('Poll options')}</span>
									{fieldErrors.pollOptions ? (
										<span className={'field-error'}>{fieldErrors.pollOptions}</span>
									) : null}
									{form.pollOptions.map((option, index) => (
										<div className={'poll-option-row'} key={`option-${index}`}>
											<label className={'visually-hidden'} htmlFor={`poll-option-${index}`}>
												{t('Option')} {index + 1}
											</label>
											<input
												id={`poll-option-${index}`}
												value={option}
												onChange={(e) => {
													const pollOptions = [...form.pollOptions];
													pollOptions[index] = e.target.value;
													patch({ pollOptions });
												}}
												placeholder={`${t('Option')} ${index + 1}`}
											/>
											{form.pollOptions.length > 2 ? (
												<button
													type="button"
													aria-label={`${t('Remove option')} ${index + 1}`}
													onClick={() =>
														patch({
															pollOptions: form.pollOptions.filter((_, i) => i !== index),
														})
													}
												>
													<DeleteOutlineOutlinedIcon />
												</button>
											) : null}
										</div>
									))}
									{form.pollOptions.length < 6 ? (
										<button
											type="button"
											className={'add-option-btn'}
											onClick={() => patch({ pollOptions: [...form.pollOptions, ''] })}
										>
											<AddRoundedIcon />
											{t('Add option')}
										</button>
									) : null}

									<div className={'field'}>
										<label htmlFor="poll-duration">{t('Poll duration')}</label>
										<Select
											id="poll-duration"
											size="small"
											value={form.pollDuration}
											onChange={(e) => patch({ pollDuration: e.target.value as CommunityPollDuration })}
										>
											{POLL_DURATIONS.map((item) => (
												<MenuItem key={item.value} value={item.value}>
													{t(item.label)}
												</MenuItem>
											))}
										</Select>
									</div>

									<FormControlLabel
										control={
											<Switch
												checked={form.allowMultiple}
												onChange={(e) => patch({ allowMultiple: e.target.checked })}
											/>
										}
										label={t('Allow multiple selections')}
									/>
									<FormControlLabel
										control={
											<Switch
												checked={form.showResultsBeforeVote}
												onChange={(e) => patch({ showResultsBeforeVote: e.target.checked })}
											/>
										}
										label={t('Show results before voting')}
									/>
								</div>
							) : null}

							{form.type === 'resource' ? (
								<>
									<div className={'field-row'}>
										<div className={'field'}>
											<label htmlFor="resource-type">{t('Resource type')}</label>
											<Select
												id="resource-type"
												size="small"
												value={form.resourceType}
												onChange={(e) =>
													patch({ resourceType: e.target.value as CommunityResourceType })
												}
											>
												{RESOURCE_TYPES.map((type) => (
													<MenuItem key={type} value={type}>
														{t(type)}
													</MenuItem>
												))}
											</Select>
										</div>
										<div className={'field'}>
											<label htmlFor="resource-topic">{t('Language / topic')}</label>
											<input
												id="resource-topic"
												value={form.resourceTopic}
												onChange={(e) => patch({ resourceTopic: e.target.value })}
											/>
										</div>
									</div>
									<div className={'field'}>
										<label htmlFor="resource-url">{t('Resource URL')}</label>
										<input
											id="resource-url"
											type="url"
											value={form.resourceUrl}
											aria-invalid={Boolean(fieldErrors.resourceUrl)}
											placeholder="https://"
											onChange={(e) => patch({ resourceUrl: e.target.value })}
										/>
										{fieldErrors.resourceUrl ? (
											<span className={'field-error'}>{fieldErrors.resourceUrl}</span>
										) : null}
									</div>
								</>
							) : null}

							{form.type === 'success' ? (
								<>
									<div className={'field-row'}>
										<div className={'field'}>
											<label htmlFor="success-goal">{t('Goal')}</label>
											<input
												id="success-goal"
												value={form.goal}
												aria-invalid={Boolean(fieldErrors.goal)}
												onChange={(e) => patch({ goal: e.target.value })}
											/>
											{fieldErrors.goal ? <span className={'field-error'}>{fieldErrors.goal}</span> : null}
										</div>
										<div className={'field'}>
											<label htmlFor="success-result">{t('Result')}</label>
											<input
												id="success-result"
												value={form.result}
												aria-invalid={Boolean(fieldErrors.result)}
												onChange={(e) => patch({ result: e.target.value })}
											/>
											{fieldErrors.result ? (
												<span className={'field-error'}>{fieldErrors.result}</span>
											) : null}
										</div>
									</div>
									<div className={'field-row'}>
										<div className={'field'}>
											<label htmlFor="before-metric">{t('Before metric (optional)')}</label>
											<input
												id="before-metric"
												value={form.beforeMetric}
												placeholder="e.g. IELTS 6.0"
												onChange={(e) => patch({ beforeMetric: e.target.value })}
											/>
										</div>
										<div className={'field'}>
											<label htmlFor="after-metric">{t('After metric (optional)')}</label>
											<input
												id="after-metric"
												value={form.afterMetric}
												placeholder="e.g. IELTS 7.5"
												onChange={(e) => patch({ afterMetric: e.target.value })}
											/>
										</div>
									</div>
								</>
							) : null}

							<AttachmentField
								attachments={form.attachments}
								onChange={(attachments) => patch({ attachments })}
							/>

							<div className={'field'}>
								<label htmlFor="visibility">{t('Visibility')}</label>
								<Select
									id="visibility"
									size="small"
									value={form.visibility}
									onChange={(e) =>
										patch({ visibility: e.target.value as CommunityCreateFormState['visibility'] })
									}
								>
									<MenuItem value="public">{t('Public')}</MenuItem>
									<MenuItem value="members">{t('Members only')}</MenuItem>
								</Select>
							</div>
						</div>

						{showPreview ? (
							<aside className={'create-preview'} aria-label={t('Preview')}>
								<button
									type="button"
									className={'preview-toggle mobile-only'}
									onClick={() => setPreviewOpen((v) => !v)}
								>
									{previewOpen ? t('Hide preview') : t('Show preview')}
								</button>
								{previewOpen ? (
									<div className={'preview-card'}>
										<span className={'preview-badge'}>
											{form.type === 'poll' ? t('Poll') : t('Resource')}
										</span>
										<h3>{form.title.trim() || t('Untitled')}</h3>
										{form.type === 'poll' ? (
											<ul className={'preview-poll'}>
												{form.pollOptions
													.map((o) => o.trim())
													.filter(Boolean)
													.map((option) => (
														<li key={option}>
															<span>{option}</span>
															<span className={'bar'} />
														</li>
													))}
											</ul>
										) : (
											<>
												<p className={'preview-type'}>{t(form.resourceType)}</p>
												<p>{form.body.trim() || t('Resource description will appear here.')}</p>
												{form.resourceUrl ? (
													<p className={'preview-url'}>{form.resourceUrl}</p>
												) : null}
											</>
										)}
									</div>
								) : null}
							</aside>
						) : null}
					</div>

					<footer className={'create-modal-footer'}>
						<p className={'draft-note'}>{t('Drafts are kept only while this dialog is open.')}</p>
						<div className={'footer-actions'}>
							<button type="button" className={'cancel-btn'} onClick={requestClose} disabled={submitting}>
								{t('Cancel')}
							</button>
							<button type="submit" className={'publish-btn'} disabled={submitting}>
								{submitting ? t('Publishing…') : t('Publish')}
							</button>
						</div>
					</footer>
				</form>
			</div>
		</Dialog>
	);
};

export default CreateCommunityContentModal;
