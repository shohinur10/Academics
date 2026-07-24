import React from 'react';
import { useTranslation } from 'next-i18next';
import { SupportTicketMessage } from '../../../types/support/request';
import Message from './Message';

interface MessageThreadProps {
	messages: SupportTicketMessage[];
}

const MessageThread = ({ messages }: MessageThreadProps) => {
	const { t } = useTranslation('common');

	const supportCount = messages.filter((message) => message.author.role === 'support').length;
	const userCount = messages.filter((message) => message.author.role === 'user').length;

	return (
		<section className={'ticket-conversation'} aria-labelledby="ticket-conversation-title">
			<div className={'ticket-conversation-heading'}>
				<h2 id="ticket-conversation-title">{t('Conversation')}</h2>
				<p>
					{supportCount} {t('Support replies')} · {userCount} {t('User replies')}
				</p>
			</div>
			<div className={'ticket-message-list'} role="log" aria-live="polite" aria-relevant="additions">
				{messages.map((message) => (
					<Message key={message.id} message={message} />
				))}
			</div>
		</section>
	);
};

export default MessageThread;
