import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { MOCK_INSTRUCTORS } from '../../mock/instructors.mock';
import { MOCK_COURSES } from '../../mock/courses.mock';

/** Placeholder portraits until instructor photos are uploaded. */
const FALLBACK_PORTRAITS = ['/img/profile/agent.png', '/img/profile/girl.svg'];

const InstructorsStrip = () => {
	const { t } = useTranslation('common');
	const instructors = MOCK_INSTRUCTORS.slice(0, 4);

	const coursesOf = (memberId: string) => MOCK_COURSES.filter((course) => course.memberId === memberId);

	return (
		<section className={'instructors-strip'} aria-labelledby="instructors-strip-title">
			<div className={'section-head'}>
				<h2 id="instructors-strip-title">{t('Featured Instructors')}</h2>
				<Link href={'/instructor'}>
					<span className={'section-link'}>
						{t('View All')} <ArrowForwardRoundedIcon />
					</span>
				</Link>
			</div>
			<div className={'instructors-row'}>
				{instructors.map((instructor, index) => {
					const courses = coursesOf(instructor._id);
					const rating = courses.length
						? courses.reduce((sum, c) => sum + (c.courseRating ?? 0), 0) / courses.length
						: undefined;
					return (
						<article key={instructor._id} className={'instructor-card'}>
							<img
								src={instructor.memberImage || FALLBACK_PORTRAITS[index % FALLBACK_PORTRAITS.length]}
								alt={`${instructor.memberNick} portrait`}
								loading="lazy"
							/>
							<h3>{instructor.memberNick}</h3>
							<p className={'specialization'}>{instructor.memberDesc}</p>
							<div className={'instructor-meta'}>
								{rating !== undefined && (
									<span className={'rating'}>
										<StarRoundedIcon />
										{rating.toFixed(1)}
									</span>
								)}
								<span>
									{courses.length} {t('Courses')}
								</span>
							</div>
							<Link href={{ pathname: '/instructor/detail', query: { id: instructor._id } }} className={'profile-btn'}>
								{t('View Profile')}
							</Link>
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default InstructorsStrip;
