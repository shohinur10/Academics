import React, { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface ReplyComposerProps {
	disabled?: boolean;
	placeholder?: string;
	replyToName?: string | null;
	initialText?: string;
	submitting?: boolean;
	onCancelReply?: () => void;
	onSubmit: (text: string) => Promise<{ ok: boolean } | void> | { ok: boolean } | void;
	autoFocus?: boolean;
}

const ReplyComposer = ({
	disabled,
	placeholder,
	replyToName,
	initialText = '',
	submitting,
	onCancelReply,
	onSubmit,
	autoFocus,
}: ReplyComposerProps) => {
	const { t } = useTranslation('common');
	const [text, setText] = useState(initialText);
	const [sending, setSending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const labelId = useId();

	useEffect(() => {
		setText(initialText);
	}, [initialText]);

	useEffect(() => {
		if (autoFocus) textareaRef.current?.focus();
	}, [autoFocus, replyToName]);

	const submit = async (event?: FormEvent) => {
		event?.preventDefault();
		const trimmed = text.trim();
		if (!trimmed || disabled || sending || submitting) return;
		setSending(true);
		const draft = text;
		setText('');
		try {
			const result = await onSubmit(trimmed);
			if (result && 'ok' in result && !result.ok) {
				setText(draft);
				textareaRef.current?.focus();
			} else {
				requestAnimationFrame(() => textareaRef.current?.focus());
			}
		} catch {
			setText(draft);
			textareaRef.current?.focus();
		} finally {
			setSending(false);
		}
	};

	return (
		<form className={'reply-composer'} onSubmit={submit} aria-labelledby={labelId}>
			<span id={labelId} className={'visually-hidden'}>
				{t('Write a reply')}
			</span>
			{replyToName ? (
				<div className={'reply-target'} role="status">
					<span>
						{t('Replying to')} <strong>{replyToName}</strong>
					</span>
					{onCancelReply ? (
						<button type="button" onClick={onCancelReply}>
							{t('Cancel')}
						</button>
					) : null}
				</div>
			) : null}
			<textarea
				ref={textareaRef}
				value={text}
				disabled={disabled || sending || submitting}
				placeholder={placeholder || t('Write a reply…')}
				rows={3}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
						e.preventDefault();
						void submit();
					}
				}}
			/>
			<div className={'composer-actions'}>
				<button type="submit" disabled={disabled || sending || submitting || !text.trim()}>
					{sending || submitting ? t('Sending…') : t('Reply')}
				</button>
			</div>
		</form>
	);
};

export default ReplyComposer;
