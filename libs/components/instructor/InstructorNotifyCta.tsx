import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { MOCK_INSTRUCTORS } from '../../mock/instructors.mock';

/**
 * Newsletter CTA placeholder.
 * Wire `onSubscribe` to an existing endpoint when available — currently a typed no-op UI only.
 */
const InstructorNotifyCta = () => {
	const { t } = useTranslation('common');
	const [email, setEmail] = useState('');
	const avatars = MOCK_INSTRUCTORS.slice(0, 4);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		// Placeholder: no fake submission. Connect to newsletter API when ready.
		setEmail('');
	};

	return (
		<section className={'instructor-notify-cta'} aria-labelledby="instructor-notify-title">
			<div className={'notify-inner'}>
				<div className={'notify-avatars'} aria-hidden="true">
					{avatars.map((instructor) => (
						<img
							key={instructor._id}
							src={instructor.memberImage || '/img/profile/defaultUser.svg'}
							alt=""
							loading="lazy"
						/>
					))}
				</div>
				<h2 id="instructor-notify-title">{t('Stay updated with new instructors')}</h2>
				<p>{t('Get notified when expert instructors join our platform.')}</p>
				<form className={'notify-form'} onSubmit={handleSubmit}>
					<label htmlFor="instructor-notify-email" className={'visually-hidden'}>
						{t('Email')}
					</label>
					<input
						id="instructor-notify-email"
						type="email"
						required
						value={email}
						placeholder={t('Enter your email')}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button type="submit">{t('Subscribe')}</button>
				</form>
			</div>
		</section>
	);
};

export default InstructorNotifyCta;
