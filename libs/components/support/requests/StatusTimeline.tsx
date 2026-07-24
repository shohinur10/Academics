import React from 'react';
import { useTranslation } from 'next-i18next';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { SupportTimelineEvent } from '../../../types/support/request';

interface StatusTimelineProps {
	events: SupportTimelineEvent[];
}

const formatDate = (iso: string | null) => {
	if (!iso) return null;
	return new Date(iso).toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const StatusTimeline = ({ events }: StatusTimelineProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'ticket-timeline'} aria-labelledby="ticket-timeline-title">
			<h2 id="ticket-timeline-title">{t('Status timeline')}</h2>
			<ol className={'ticket-timeline-list'}>
				{events.map((event) => (
					<li
						key={event.id}
						className={[
							'ticket-timeline-item',
							event.completed ? 'done' : '',
							event.current ? 'current' : '',
						]
							.filter(Boolean)
							.join(' ')}
						aria-current={event.current ? 'step' : undefined}
					>
						<span className={'ticket-timeline-dot'} aria-hidden="true">
							{event.completed ? <CheckRoundedIcon fontSize="inherit" /> : null}
						</span>
						<div className={'ticket-timeline-copy'}>
							<p className={'ticket-timeline-label'}>{t(event.label)}</p>
							{event.at ? <time dateTime={event.at}>{formatDate(event.at)}</time> : <span>—</span>}
						</div>
					</li>
				))}
			</ol>
		</section>
	);
};

export default StatusTimeline;
