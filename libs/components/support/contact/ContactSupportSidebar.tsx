import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { SupportTicketPriority, estimatedResponseFor } from '../../../types/support/contact';

interface ContactSupportSidebarProps {
	priority: SupportTicketPriority | '';
}

const ContactSupportSidebar = ({ priority }: ContactSupportSidebarProps) => {
	const { t } = useTranslation('common');
	const eta = estimatedResponseFor(priority || 'normal');

	return (
		<aside className={'contact-sidebar'} aria-label={t('Other ways to get help')}>
			<div className={'contact-eta-card'}>
				<span className={'contact-eta-icon'} aria-hidden="true">
					<AccessTimeOutlinedIcon />
				</span>
				<div>
					<p className={'contact-eta-label'}>{t('Estimated response time')}</p>
					<p className={'contact-eta-value'}>{t(eta)}</p>
					<p className={'contact-eta-hint'}>
						{t('Based on the priority you select. Urgent cases are reviewed first.')}
					</p>
				</div>
			</div>

			<ul className={'contact-side-list'}>
				<li>
					<div className={'contact-side-card'}>
						<span className={'contact-side-icon'} aria-hidden="true">
							<ChatBubbleOutlineOutlinedIcon />
						</span>
						<div>
							<h3>{t('Live Chat')}</h3>
							<p>{t('Available on business days during office hours for quick questions.')}</p>
							<span className={'contact-side-meta'}>{t('Mon–Fri · peak coverage')}</span>
						</div>
					</div>
				</li>
				<li>
					<a href="mailto:support@academics.app" className={'contact-side-card link'}>
						<span className={'contact-side-icon'} aria-hidden="true">
							<MailOutlineOutlinedIcon />
						</span>
						<div>
							<h3>{t('Email')}</h3>
							<p>{t('support@academics.app')}</p>
							<span className={'contact-side-meta'}>{t('Best for detailed cases')}</span>
						</div>
					</a>
				</li>
				<li>
					<div className={'contact-side-card'}>
						<span className={'contact-side-icon'} aria-hidden="true">
							<ScheduleOutlinedIcon />
						</span>
						<div>
							<h3>{t('Office Hours')}</h3>
							<p>{t('Monday–Friday, 09:00–18:00 KST')}</p>
							<span className={'contact-side-meta'}>{t('Excluding public holidays')}</span>
						</div>
					</div>
				</li>
				<li>
					<Link href="/community" className={'contact-side-card link'}>
						<span className={'contact-side-icon'} aria-hidden="true">
							<GroupsOutlinedIcon />
						</span>
						<div>
							<h3>{t('Community Help')}</h3>
							<p>{t('Ask learners and instructors in the ACADEMICS Community.')}</p>
							<span className={'contact-side-meta'}>{t('Open community')}</span>
						</div>
					</Link>
				</li>
			</ul>
		</aside>
	);
};

export default ContactSupportSidebar;
