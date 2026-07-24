import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { HelpContactAction, HelpContactOption } from '../../../types/support/helpCenter';

const ICONS: Record<HelpContactAction, React.ReactNode> = {
	chat: <ChatBubbleOutlineOutlinedIcon />,
	request: <AssignmentOutlinedIcon />,
	email: <MailOutlineOutlinedIcon />,
	community: <GroupsOutlinedIcon />,
};

interface HelpContactOptionsProps {
	options: HelpContactOption[];
}

const HelpContactOptions = ({ options }: HelpContactOptionsProps) => {
	const { t } = useTranslation('common');

	return (
		<section className={'help-section help-contact'} aria-labelledby="help-contact-title">
			<div className={'section-heading'}>
				<h2 id="help-contact-title">{t('Contact support')}</h2>
				<p>{t('Choose the channel that fits your question best.')}</p>
			</div>
			<ul className={'contact-grid'}>
				{options.map((option) => {
					const external = option.href.startsWith('mailto:') || option.href.startsWith('http');
					const content = (
						<>
							<span className={'contact-icon'} aria-hidden="true">
								{ICONS[option.id]}
							</span>
							<h3>{t(option.title)}</h3>
							<p>{t(option.description)}</p>
							<span className={'contact-cta'}>{t(option.cta)}</span>
						</>
					);
					return (
						<li key={option.id}>
							{external ? (
								<a href={option.href} className={'contact-card'}>
									{content}
								</a>
							) : (
								<Link href={option.href} className={'contact-card'}>
									{content}
								</Link>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default HelpContactOptions;
