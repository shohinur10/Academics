import React from 'react';
import { useTranslation } from 'next-i18next';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { Member } from '../../../types/member/member';

interface InstructorScheduleProps {
	instructor: Member;
}

const InstructorSchedule = ({ instructor }: InstructorScheduleProps) => {
	const { t } = useTranslation('common');
	const slots = instructor.memberSchedule ?? [];

	if (!slots.length) return null;

	return (
		<div className={'instructor-schedule'}>
			<div className={'schedule-meta'}>
				{instructor.memberTimezone && (
					<span>
						<PublicOutlinedIcon />
						{t('Timezone')}: {instructor.memberTimezone}
					</span>
				)}
				{instructor.memberNextAvailable && (
					<span>
						<EventAvailableOutlinedIcon />
						{t('Next available')}: {instructor.memberNextAvailable}
					</span>
				)}
			</div>

			<ul className={'schedule-grid'}>
				{slots.map((slot) => (
					<li key={slot.day}>
						<strong>{t(slot.day)}</strong>
						<div className={'blocks'}>
							{slot.blocks.map((block) => (
								<span key={block}>
									<ScheduleOutlinedIcon />
									{block}
								</span>
							))}
						</div>
					</li>
				))}
			</ul>

			{/* Read-only placeholder — no booking backend yet. */}
			<button type="button" className={'book-trial-btn'} disabled aria-disabled="true">
				{t('Book Trial Lesson')}
				<span className={'soon'}>{t('Coming soon')}</span>
			</button>
		</div>
	);
};

export default InstructorSchedule;
