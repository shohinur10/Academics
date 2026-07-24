import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import InstructorProfileHero from '../../libs/components/instructor/detail/InstructorProfileHero';
import InstructorProfileTabs, {
	InstructorProfileTabId,
} from '../../libs/components/instructor/detail/InstructorProfileTabs';
import InstructorAbout from '../../libs/components/instructor/detail/InstructorAbout';
import InstructorReviewsPanel from '../../libs/components/instructor/detail/InstructorReviewsPanel';
import InstructorSchedule from '../../libs/components/instructor/detail/InstructorSchedule';
import InstructorVideos from '../../libs/components/instructor/detail/InstructorVideos';
import InstructorCertifications from '../../libs/components/instructor/detail/InstructorCertifications';
import InstructorIntroVideoModal from '../../libs/components/instructor/detail/InstructorIntroVideoModal';
import InstructorCatalogCard from '../../libs/components/instructor/InstructorCatalogCard';
import CourseCatalogCard from '../../libs/components/course/CourseCatalogCard';
import CoursePreviewModal from '../../libs/components/course/CoursePreviewModal';
import {
	getInstructorById,
	getRelatedInstructors,
} from '../../libs/mock/instructors.mock';
import { MOCK_COURSES } from '../../libs/mock/courses.mock';
import { Member, InstructorVideoItem } from '../../libs/types/member/member';
import { Course } from '../../libs/types/course/course';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const TAB_DEFS: { id: InstructorProfileTabId; label: string }[] = [
	{ id: 'about', label: 'About' },
	{ id: 'courses', label: 'Courses' },
	{ id: 'reviews', label: 'Reviews' },
	{ id: 'schedule', label: 'Schedule' },
	{ id: 'videos', label: 'Videos' },
	{ id: 'certifications', label: 'Certifications' },
];

const InstructorDetail: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [instructor, setInstructor] = useState<Member | null>(null);
	const [activeTab, setActiveTab] = useState<InstructorProfileTabId>('about');
	const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [introVideo, setIntroVideo] = useState<InstructorVideoItem | null>(null);
	const [introOpen, setIntroOpen] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		const id = typeof router.query.id === 'string' ? router.query.id : undefined;
		// TODO(backend): replace getInstructorById with GET_INSTRUCTOR / member query by id
		setInstructor(id ? getInstructorById(id) ?? null : null);

		const hash = (router.asPath.split('#')[1] || '') as InstructorProfileTabId;
		if (TAB_DEFS.some((tab) => tab.id === hash)) setActiveTab(hash);
	}, [router.isReady, router.query.id, router.asPath]);

	const courses = useMemo(
		() => (instructor ? MOCK_COURSES.filter((course) => course.memberId === instructor._id) : []),
		[instructor],
	);
	const related = useMemo(() => (instructor ? getRelatedInstructors(instructor, 4) : []), [instructor]);

	const tabs = useMemo(
		() =>
			TAB_DEFS.map((tab) => ({
				...tab,
				count:
					tab.id === 'courses'
						? courses.length
						: tab.id === 'reviews'
							? instructor?.memberReviewsCount
							: undefined,
			})),
		[courses.length, instructor?.memberReviewsCount],
	);

	/** HANDLERS **/
	const openCoursePreview = (course: Course) => {
		setPreviewCourse(course);
		setPreviewOpen(true);
	};

	const openIntro = (video?: InstructorVideoItem) => {
		if (!instructor) return;
		const target =
			video ??
			instructor.memberVideos?.[0] ??
			(instructor.memberIntroVideoUrl
				? {
						id: `${instructor._id}-intro`,
						title: 'Introduction',
						duration: '1:45',
						posterUrl: instructor.memberImage || '/img/profile/defaultUser.svg',
						videoUrl: instructor.memberIntroVideoUrl,
				  }
				: null);
		if (!target) return;
		setIntroVideo(target);
		setIntroOpen(true);
	};

	const selectTab = (tabId: InstructorProfileTabId) => {
		setActiveTab(tabId);
		const base = router.asPath.split('#')[0];
		router.replace(`${base}#${tabId}`, undefined, { shallow: true, scroll: false });
	};

	if (!router.isReady) {
		return (
			<div className={'instructor-detail-page'}>
				<div className={'detail-skeleton'} aria-busy="true" aria-label={t('Loading instructor')}>
					<div className={'sk-line w-30'} />
					<div className={'sk-block'} />
					<div className={'sk-line w-70'} />
					<div className={'sk-line w-50'} />
				</div>
			</div>
		);
	}

	if (!instructor) {
		return (
			<div className={'instructor-detail-page'}>
				<div className={'detail-not-found'}>
					<h1>{t('Instructor not found')}</h1>
					<p>{t('The instructor you are looking for does not exist or is no longer available.')}</p>
					<Link href={'/instructor'} className={'not-found-btn'}>
						{t('Browse Instructors')}
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className={'instructor-detail-page'}>
			<Head>
				<title>{`${instructor.memberNick} — Academics`}</title>
				<meta name="description" content={instructor.memberDesc} />
				<meta property="og:title" content={`${instructor.memberNick} — Academics`} />
				<meta property="og:description" content={instructor.memberDesc} />
				<meta property="og:image" content={instructor.memberImage} />
				<meta property="og:type" content="profile" />
			</Head>

			<nav className={'detail-breadcrumbs'} aria-label="Breadcrumb">
				<ol>
					<li>
						<Link href={'/'}>{t('Home')}</Link>
						<ChevronRightRoundedIcon aria-hidden="true" />
					</li>
					<li>
						<Link href={'/instructor'}>{t('Instructors')}</Link>
						<ChevronRightRoundedIcon aria-hidden="true" />
					</li>
					<li aria-current="page">{instructor.memberNick}</li>
				</ol>
			</nav>

			<div className={'detail-container'}>
				<InstructorProfileHero instructor={instructor} onPlayIntro={() => openIntro()} />

				<InstructorProfileTabs tabs={tabs} activeTab={activeTab} onSelect={selectTab} />

				<section
					id="about"
					className={'tab-panel'}
					role="tabpanel"
					hidden={activeTab !== 'about'}
					aria-labelledby="tab-about"
				>
					<h2 className={'visually-hidden'}>{t('About')}</h2>
					<InstructorAbout instructor={instructor} />
				</section>

				<section
					id="courses"
					className={'tab-panel'}
					role="tabpanel"
					hidden={activeTab !== 'courses'}
					aria-labelledby="tab-courses"
				>
					<h2>{t('My Courses')}</h2>
					{courses.length === 0 ? (
						<p className={'empty-copy'}>{t('No courses yet.')}</p>
					) : (
						<div className={'instructor-courses-grid'}>
							{courses.map((course) => (
								<CourseCatalogCard key={course._id} course={course} onPreview={openCoursePreview} />
							))}
						</div>
					)}
				</section>

				<section
					id="reviews"
					className={'tab-panel'}
					role="tabpanel"
					hidden={activeTab !== 'reviews'}
					aria-labelledby="tab-reviews"
				>
					<h2>{t('Student Reviews')}</h2>
					<InstructorReviewsPanel instructor={instructor} />
				</section>

				<section
					id="schedule"
					className={'tab-panel'}
					role="tabpanel"
					hidden={activeTab !== 'schedule'}
					aria-labelledby="tab-schedule"
				>
					<h2>{t('Schedule')}</h2>
					<InstructorSchedule instructor={instructor} />
				</section>

				<section
					id="videos"
					className={'tab-panel'}
					role="tabpanel"
					hidden={activeTab !== 'videos'}
					aria-labelledby="tab-videos"
				>
					<h2>{t('Videos')}</h2>
					<InstructorVideos instructor={instructor} onPlay={openIntro} />
				</section>

				<section
					id="certifications"
					className={'tab-panel'}
					role="tabpanel"
					hidden={activeTab !== 'certifications'}
					aria-labelledby="tab-certifications"
				>
					<h2>{t('Certifications')}</h2>
					<InstructorCertifications instructor={instructor} />
				</section>
			</div>

			{related.length !== 0 && (
				<section className={'related-instructors'} aria-labelledby="related-instructors-title">
					<div className={'detail-container'}>
						<h2 id="related-instructors-title">{t('Related Instructors')}</h2>
						<div className={'related-instructors-grid'}>
							{related.map((item) => (
								<InstructorCatalogCard key={item._id} instructor={item} />
							))}
						</div>
					</div>
				</section>
			)}

			<CoursePreviewModal isOpen={previewOpen} course={previewCourse} onClose={() => setPreviewOpen(false)} />
			<InstructorIntroVideoModal
				isOpen={introOpen}
				instructor={instructor}
				video={introVideo}
				onClose={() => setIntroOpen(false)}
			/>
		</div>
	);
};

export default withLayoutCourse(InstructorDetail, { title: 'Instructor — Academics' });
