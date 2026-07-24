import React from 'react';
import { useTranslation } from 'next-i18next';
import { SystemStatusItem } from '../../../types/support/helpCenter';

interface HelpSystemStatusProps {
	items: SystemStatusItem[];
}

const statusLabel = (status: SystemStatusItem['status'], t: (k: string) => string) => {
	switch (status) {
		case 'degraded':
			return t('Degraded');
		case 'outage':
			return t('Outage');
		default:
			return t('Operational');
	}
};

const HelpSystemStatus = ({ items }: HelpSystemStatusProps) => {
	const { t } = useTranslation('common');
	const allOperational = items.every((item) => item.status === 'operational');

	return (
		<section className={'help-section help-status'} aria-labelledby="help-status-title">
			<div className={'status-card'}>
				<div className={'status-head'}>
					<div>
						<h2 id="help-status-title">{t('Platform system status')}</h2>
						<p>
							{allOperational
								? t('All systems are operating normally.')
								: t('Some services need attention. Check details below.')}
						</p>
					</div>
					<span className={`status-pill ${allOperational ? 'ok' : 'warn'}`}>
						{allOperational ? t('All operational') : t('Attention')}
					</span>
				</div>
				<ul className={'status-list'}>
					{items.map((item) => (
						<li key={item.id}>
							<span>{t(item.name)}</span>
							<span className={`status-value status-${item.status}`}>
								<span className={'dot'} aria-hidden="true" />
								{statusLabel(item.status, t)}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default HelpSystemStatus;
