import React, { useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import ContactSupportForm from '../../libs/components/support/contact/ContactSupportForm';
import ContactSupportSidebar from '../../libs/components/support/contact/ContactSupportSidebar';
import { useCourses } from '../../libs/hooks/useCourses';
import { Direction } from '../../libs/enums/common.enum';
import { CoursesInquiry } from '../../libs/types/course/course.input';
import { emptySupportTicketInput } from '../../libs/types/support/contact';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const courseInquiry: CoursesInquiry = {
	page: 1,
	limit: 40,
	sort: 'courseRank',
	direction: Direction.DESC,
	search: {},
};

/** Contact Support — create a ticket with validated form + isolated API submitter. */
const SupportContactPage: NextPage = () => {
	const { t } = useTranslation('common');
	const [priority, setPriority] = useState(emptySupportTicketInput().priority);
	const { courses, loading: coursesLoading } = useCourses(courseInquiry);

	const courseOptions = useMemo(
		() =>
			courses.map((course) => ({
				id: course._id,
				title: course.courseTitle,
			})),
		[courses],
	);

	return (
		<div className={'contact-support-page'}>
			<div className={'contact-support-container'}>
				<nav className={'contact-breadcrumb'} aria-label={t('Breadcrumb')}>
					<Link href="/cs">{t('Help Center')}</Link>
					<span aria-hidden="true">/</span>
					<span>{t('Contact Support')}</span>
				</nav>

				<header className={'contact-support-header'}>
					<p className={'help-eyebrow'}>{t('Help Center')}</p>
					<h1>{t('Contact Support')}</h1>
					<p>{t('Create a support ticket. We will reply based on your selected priority.')}</p>
				</header>

				<div className={'contact-support-layout'}>
					<div className={'contact-support-main'}>
						<ContactSupportForm
							courses={courseOptions}
							coursesLoading={coursesLoading}
							onPriorityChange={setPriority}
						/>
					</div>
					<ContactSupportSidebar priority={priority} />
				</div>
			</div>
		</div>
	);
};

export default withLayoutCourse(SupportContactPage, { title: 'Contact Support — Academics' });
