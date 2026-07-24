import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';

type HelpfulVote = 'yes' | 'no';

interface HelpfulButtonsProps {
	articleId: string;
	showContactCta?: boolean;
	contactHref?: string;
}

const storageKey = (articleId: string) => `academics.faq.helpful.${articleId}`;

const HelpfulButtons = ({
	articleId,
	showContactCta = true,
	contactHref = '/support/contact',
}: HelpfulButtonsProps) => {
	const { t } = useTranslation('common');
	const [vote, setVote] = useState<HelpfulVote | null>(null);

	useEffect(() => {
		try {
			const saved = window.localStorage.getItem(storageKey(articleId));
			if (saved === 'yes' || saved === 'no') setVote(saved);
			else setVote(null);
		} catch {
			setVote(null);
		}
	}, [articleId]);

	const cast = (next: HelpfulVote) => {
		setVote(next);
		try {
			window.localStorage.setItem(storageKey(articleId), next);
		} catch {
			/* ignore quota / private mode */
		}
	};

	return (
		<div className={'faq-helpful-block'}>
			<div className={'faq-helpful'}>
				<p className={'faq-helpful-label'}>{t('Was this helpful?')}</p>
				{vote ? (
					<p className={'faq-helpful-thanks'} role="status">
						{vote === 'yes' ? t('Thanks for your feedback.') : t('Thanks — we will improve this article.')}
					</p>
				) : (
					<div className={'faq-helpful-actions'} role="group" aria-label={t('Was this helpful?')}>
						<button
							type="button"
							className={'faq-helpful-btn yes'}
							aria-pressed={false}
							onClick={() => cast('yes')}
						>
							<ThumbUpOffAltOutlinedIcon fontSize="small" aria-hidden="true" />
							{t('Yes')}
						</button>
						<button
							type="button"
							className={'faq-helpful-btn no'}
							aria-pressed={false}
							onClick={() => cast('no')}
						>
							<ThumbDownOffAltOutlinedIcon fontSize="small" aria-hidden="true" />
							{t('No')}
						</button>
					</div>
				)}
			</div>

			{showContactCta ? (
				<div className={'faq-still-need-help'}>
					<p>{t('Still need help?')}</p>
					<Link href={contactHref} className={'faq-contact-btn'}>
						{t('Contact Support')}
					</Link>
				</div>
			) : null}
		</div>
	);
};

export default HelpfulButtons;
