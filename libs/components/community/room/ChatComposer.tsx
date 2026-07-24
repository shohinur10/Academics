import React, { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';

interface ChatComposerProps {
	disabled?: boolean;
	placeholder?: string;
	onSend: (text: string) => Promise<{ ok: boolean } | void> | { ok: boolean } | void;
	onTyping: (active: boolean) => void;
	onEmoji: () => void;
	onAttach: () => void;
	onMention: () => void;
}

const ChatComposer = ({
	disabled,
	placeholder,
	onSend,
	onTyping,
	onEmoji,
	onAttach,
	onMention,
}: ChatComposerProps) => {
	const { t } = useTranslation('common');
	const [text, setText] = useState('');
	const [sending, setSending] = useState(false);
	const typingTimeout = useRef<number | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		return () => {
			if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
		};
	}, []);

	const resize = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = '0px';
		el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
	};

	const handleChange = (value: string) => {
		setText(value);
		onTyping(true);
		if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
		typingTimeout.current = window.setTimeout(() => onTyping(false), 1200);
		requestAnimationFrame(resize);
	};

	const submit = async () => {
		const trimmed = text.trim();
		if (!trimmed || disabled || sending) return;
		setSending(true);
		const draft = text;
		setText('');
		onTyping(false);
		requestAnimationFrame(resize);
		try {
			const result = await onSend(trimmed);
			if (result && 'ok' in result && !result.ok) {
				setText(draft);
			}
		} catch {
			setText(draft);
		} finally {
			setSending(false);
			requestAnimationFrame(resize);
		}
	};

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		submit();
	};

	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			submit();
		}
	};

	return (
		<form className={'chat-composer'} onSubmit={onSubmit}>
			<div className={'composer-tools'}>
				<button type="button" aria-label={t('Insert emoji')} onClick={onEmoji}>
					<SentimentSatisfiedAltOutlinedIcon />
				</button>
				<button type="button" aria-label={t('Attach file')} onClick={onAttach}>
					<AttachFileOutlinedIcon />
				</button>
				<button type="button" aria-label={t('Mention someone')} onClick={onMention}>
					<AlternateEmailOutlinedIcon />
				</button>
			</div>
			<label htmlFor="chat-composer-input" className={'visually-hidden'}>
				{t('Message')}
			</label>
			<textarea
				id="chat-composer-input"
				ref={textareaRef}
				rows={1}
				value={text}
				disabled={disabled || sending}
				placeholder={placeholder ?? t('Write a message…')}
				onChange={(e) => handleChange(e.target.value)}
				onKeyDown={onKeyDown}
			/>
			<button
				type="submit"
				className={'send-btn'}
				disabled={disabled || sending || !text.trim()}
				aria-label={t('Send message')}
			>
				<SendRoundedIcon />
			</button>
		</form>
	);
};

export default ChatComposer;
