import React from 'react';
import { useTranslation } from 'next-i18next';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Member } from '../../../types/member/member';

interface InstructorAboutProps {
	instructor: Member;
}

const ICON_MAP = {
	students: GroupsOutlinedIcon,
	practice: ForumOutlinedIcon,
	support: FavoriteBorderIcon,
};

const InstructorAbout = ({ instructor }: InstructorAboutProps) => {
	const { t } = useTranslation('common');
	const paragraphs = instructor.memberLongBio ?? (instructor.memberDesc ? [instructor.memberDesc] : []);

	const infoRows = [
		{ label: t('Nationality'), value: instructor.memberNationality },
		{ label: t('Languages'), value: instructor.memberLanguages?.join(', ') },
		{ label: t('Specialization'), value: instructor.memberTitle },
		{ label: t('Education'), value: instructor.memberEducation },
		{ label: t('Teaching Style'), value: instructor.memberTeachingStyleLabel },
	].filter((row) => Boolean(row.value));

	return (
		<div className={'instructor-about'}>
			<div className={'about-copy'}>
				<h2>{t('About Me')}</h2>
				{paragraphs.map((paragraph) => (
					<p key={paragraph.slice(0, 48)}>{paragraph}</p>
				))}
			</div>

			{infoRows.length !== 0 && (
				<dl className={'about-info'}>
					{infoRows.map((row) => (
						<div key={row.label} className={'info-row'}>
							<dt>{row.label}</dt>
							<dd>{row.value}</dd>
						</div>
					))}
				</dl>
			)}

			{instructor.memberTeachingStyleItems?.length ? (
				<div className={'teaching-style-card'}>
					<h3>{t('Teaching Style')}</h3>
					<ul>
						{instructor.memberTeachingStyleItems.map((item) => {
							const Icon = ICON_MAP[item.icon ?? 'students'];
							return (
								<li key={item.title}>
									<span className={'style-icon'}>
										<Icon />
									</span>
									<div>
										<strong>{t(item.title)}</strong>
										<p>{t(item.description)}</p>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			) : null}
		</div>
	);
};

export default InstructorAbout;
