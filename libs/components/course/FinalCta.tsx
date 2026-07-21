import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const FinalCta = () => {
	const { t } = useTranslation('common');

	return (
		<section className={'final-cta'} aria-labelledby="final-cta-title">
			<div className={'final-cta-inner'}>
				<h2 id="final-cta-title">{t('Start your learning journey today')}</h2>
				<p>{t('Join thousands of students and unlock your potential.')}</p>
				<div className={'final-cta-actions'}>
					<Link href={'/account/join'} className={'cta-primary'}>
						{t('Get Started')}
						<ArrowForwardRoundedIcon />
					</Link>
					<Link href={'/cs'} className={'cta-secondary'}>
						{t('Contact Support')}
					</Link>
				</div>
			</div>
		</section>
	);
};

export default FinalCta;
