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
import { userVar } from '../../../../apollo/store';
import { REACT_APP_API_URL } from '../../../config';
import TagInput from '../create/TagInput';
import {
	emptyStudyGroupCreateForm,
	STUDY_GROUP_GOALS,
	STUDY_GROUP_LANGUAGES,
	STUDY_GROUP_LEVELS,
	StudyGroupCreateForm,
} from '../../../types/community/group';
import { createStudyGroup } from '../../../mock/communityGroups.store';
import { closeCreateStudyGroupModal, createStudyGroupModalVar } from './createStudyGroupModalState';

const resolveAvatar = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const CreateStudyGroupModal = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const modal = useReactiveVar(createStudyGroupModalVar);
	const user = useReactiveVar(userVar);
	const fullScreen = useMediaQuery('(max-width:767px)');
	const titleId = useId();
	const errorSummaryRef = useRef<HTMLDivElement>(null);
	const submittingRef = useRef(false);

	const [form, setForm] = useState<StudyGroupCreateForm>(emptyStudyGroupCreateForm());
	const [errors, setErrors] = useState<string[]>([]);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!modal.open) return;
		setForm(emptyStudyGroupCreateForm());
		setErrors([]);
		setFieldErrors({});
		setSubmitting(false);
		submittingRef.current = false;
	}, [modal.open]);

	const dirty = useMemo(() => {
		const empty = emptyStudyGroupCreateForm();
		return (
			form.name !== empty.name ||
			form.description !== empty.description ||
			form.tags.length > 0 ||
			form.coverImage.trim() !== '' ||
			form.rulesText !== empty.rulesText
		);
	}, [form]);

	const patch = (partial: Partial<StudyGroupCreateForm>) => setForm((prev) => ({ ...prev, ...partial }));

	const validate = () => {
		const nextErrors: string[] = [];
		const nextFields: Record<string, string> = {};
		if (!form.name.trim()) {
			nextFields.name = t('Group name is required');
			nextErrors.push(t('Group name is required'));
		}
		if (!form.description.trim()) {
			nextFields.description = t('Description is required');
			nextErrors.push(t('Description is required'));
		}
		if (form.memberLimit < 2) {
			nextFields.memberLimit = t('Member limit must be at least 2');
			nextErrors.push(t('Member limit must be at least 2'));
		}
		if (!user?._id) {
			nextErrors.push(t('Sign in to create a study group.'));
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
		closeCreateStudyGroupModal();
	};

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (submittingRef.current) return;
		if (!validate()) return;
		submittingRef.current = true;
		setSubmitting(true);
		setErrors([]);
		try {
			const result = await createStudyGroup({
				form,
				userId: user._id,
				userName: user.memberNick || 'You',
				userAvatar: resolveAvatar(user.memberImage),
			});
			if (!result.ok) {
				setErrors([t(result.error)]);
				errorSummaryRef.current?.focus();
				return;
			}
			closeCreateStudyGroupModal();
			if (result.group) {
				await router.push(`/community/groups/${result.group.slug}`);
			}
		} catch {
			setErrors([t('Unable to create group. Please try again.')]);
			errorSummaryRef.current?.focus();
		} finally {
			submittingRef.current = false;
			setSubmitting(false);
		}
	};

	return (
		<Dialog
			open={modal.open}
			onClose={requestClose}
			fullScreen={fullScreen}
			className={'create-community-modal create-study-group-modal'}
			aria-labelledby={titleId}
			disableEscapeKeyDown={submitting}
		>
			<div className={'create-modal-inner'}>
				<header className={'create-modal-head'}>
					<div>
						<p className={'eyebrow'}>{t('Study Groups')}</p>
						<h2 id={titleId}>{t('Create Group')}</h2>
					</div>
					<IconButton aria-label={t('Close')} onClick={requestClose} disabled={submitting}>
						<CloseOutlinedIcon />
					</IconButton>
				</header>

				<form className={'create-modal-form'} onSubmit={onSubmit} noValidate>
					{errors.length > 0 ? (
						<div className={'error-summary'} ref={errorSummaryRef} tabIndex={-1} role="alert">
							<strong>{t('Please fix the following')}</strong>
							<ul>
								{errors.map((err) => (
									<li key={err}>{err}</li>
								))}
							</ul>
						</div>
					) : null}

					{!user?._id ? (
						<p className={'auth-hint'}>
							{t('Sign in required.')}{' '}
							<a href="/account/join">{t('Join / Login')}</a>
						</p>
					) : null}

					<div className={'field-block'}>
						<label htmlFor="sg-name">{t('Group name')}</label>
						<input
							id="sg-name"
							value={form.name}
							onChange={(e) => patch({ name: e.target.value })}
							aria-invalid={Boolean(fieldErrors.name)}
							maxLength={80}
						/>
						{fieldErrors.name ? <p className={'field-error'}>{fieldErrors.name}</p> : null}
					</div>

					<div className={'field-block'}>
						<label htmlFor="sg-desc">{t('Description')}</label>
						<textarea
							id="sg-desc"
							rows={4}
							value={form.description}
							onChange={(e) => patch({ description: e.target.value })}
							aria-invalid={Boolean(fieldErrors.description)}
						/>
						{fieldErrors.description ? <p className={'field-error'}>{fieldErrors.description}</p> : null}
					</div>

					<div className={'field-grid-2'}>
						<FormControl fullWidth size="small">
							<label id="sg-lang-label">{t('Language')}</label>
							<Select
								labelId="sg-lang-label"
								value={form.language}
								onChange={(e) => patch({ language: e.target.value as StudyGroupCreateForm['language'] })}
							>
								{STUDY_GROUP_LANGUAGES.map((lang) => (
									<MenuItem key={lang} value={lang}>
										{lang}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth size="small">
							<label id="sg-level-label">{t('Level')}</label>
							<Select
								labelId="sg-level-label"
								value={form.level}
								onChange={(e) => patch({ level: e.target.value as StudyGroupCreateForm['level'] })}
							>
								{STUDY_GROUP_LEVELS.map((level) => (
									<MenuItem key={level} value={level}>
										{t(level)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div className={'field-grid-2'}>
						<FormControl fullWidth size="small">
							<label id="sg-goal-label">{t('Goal')}</label>
							<Select
								labelId="sg-goal-label"
								value={form.goal}
								onChange={(e) => patch({ goal: e.target.value as StudyGroupCreateForm['goal'] })}
							>
								{STUDY_GROUP_GOALS.map((goal) => (
									<MenuItem key={goal} value={goal}>
										{t(goal)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className={'field-block'}>
							<label htmlFor="sg-limit">{t('Member limit')}</label>
							<input
								id="sg-limit"
								type="number"
								min={2}
								max={5000}
								value={form.memberLimit}
								onChange={(e) => patch({ memberLimit: Number(e.target.value) || 0 })}
								aria-invalid={Boolean(fieldErrors.memberLimit)}
							/>
							{fieldErrors.memberLimit ? <p className={'field-error'}>{fieldErrors.memberLimit}</p> : null}
						</div>
					</div>

					<FormControlLabel
						control={
							<Switch
								checked={form.privacy === 'private'}
								onChange={(e) => patch({ privacy: e.target.checked ? 'private' : 'public' })}
							/>
						}
						label={t('Private group (approval required)')}
					/>

					<TagInput value={form.tags} onChange={(tags) => patch({ tags })} />

					<div className={'field-block'}>
						<label htmlFor="sg-cover">{t('Cover image URL')}</label>
						<input
							id="sg-cover"
							type="url"
							value={form.coverImage}
							placeholder="https://"
							onChange={(e) => patch({ coverImage: e.target.value })}
						/>
					</div>

					<div className={'field-block'}>
						<label htmlFor="sg-rules">{t('Rules')}</label>
						<textarea
							id="sg-rules"
							rows={4}
							value={form.rulesText}
							onChange={(e) => patch({ rulesText: e.target.value })}
							aria-describedby="sg-rules-hint"
						/>
						<p id="sg-rules-hint" className={'field-hint'}>
							{t('One rule per line')}
						</p>
					</div>

					<div className={'create-modal-actions'}>
						<button type="button" className={'btn-secondary'} onClick={requestClose} disabled={submitting}>
							{t('Cancel')}
						</button>
						<button type="submit" className={'btn-primary'} disabled={submitting || !user?._id}>
							{submitting ? t('Creating…') : t('Create Group')}
						</button>
					</div>
				</form>
			</div>
		</Dialog>
	);
};

export default CreateStudyGroupModal;
