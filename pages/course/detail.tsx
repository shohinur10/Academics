import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import CoursePreviewModal from '../../libs/components/course/CoursePreviewModal';
import CourseCatalogCard from '../../libs/components/course/CourseCatalogCard';
import PurchaseCard from '../../libs/components/course/detail/PurchaseCard';
import CurriculumAccordion from '../../libs/components/course/detail/CurriculumAccordion';
import InstructorCard from '../../libs/components/course/detail/InstructorCard';
import CourseReviews from '../../libs/components/course/detail/CourseReviews';
import RatingDisplay from '../../libs/components/course/RatingDisplay';
import PriceDisplay from '../../libs/components/course/PriceDisplay';
import FinalCta from '../../libs/components/course/FinalCta';
import { getCourseById, getRelatedCourses } from '../../libs/mock/courses.mock';
import { Course } from '../../libs/types/course/course';
import { REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ANCHOR_SECTIONS = [
	{ id: 'overview', label: 'Overview' },
	{ id: 'curriculum', label: 'Curriculum' },
	{ id: 'instructor', label: 'Instructor' },
	{ id: 'reviews', label: 'Reviews' },
];

const CourseDetail: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [course, setCourse] = useState<Course | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
	const [showFullDesc, setShowFullDesc] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		const courseId = typeof router.query.id === 'string' ? router.query.id : undefined;
		setCourse(courseId ? getCourseById(courseId) ?? null : null);
		setShowFullDesc(false);
	}, [router.isReady, router.query.id]);

	const relatedCourses = useMemo(() => (course ? getRelatedCourses(course, 4) : []), [course]);

	/** HANDLERS **/
	const openPreview = (target: Course) => {
		setPreviewCourse(target);
		setPreviewOpen(true);
	};

	const closePreview = () => setPreviewOpen(false);

	/** Loading skeleton while the query param is not resolved yet. **/
	if (!router.isReady) {
		return (
			<div className={'course-detail-page'}>
				<div className={'detail-skeleton'} aria-busy="true" aria-label={t('Loading course')}>
					<div className={'sk-line w-30'} />
					<div className={'sk-line w-70 tall'} />
					<div className={'sk-line w-50'} />
					<div className={'sk-block'} />
				</div>
			</div>
		);
	}

	/** Not-found / invalid id state. **/
	if (!course) {
		return (
			<div className={'course-detail-page'}>
				<div className={'detail-not-found'}>
					<h1>{t('Course not found')}</h1>
					<p>{t('The course you are looking for does not exist or is no longer available.')}</p>
					<Link href={'/course'} className={'not-found-btn'}>
						{t('Browse Courses')}
					</Link>
				</div>
			</div>
		);
	}

	const instructorImage = course.memberData?.memberImage
		? `${REACT_APP_API_URL}/${course.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';
	// Acronym categories (IELTS/TOEIC) stay uppercase; others get title case.
	const categoryLabel = ['IELTS', 'TOEIC'].includes(course.courseCategory)
		? course.courseCategory
		: course.courseCategory.charAt(0) + course.courseCategory.slice(1).toLowerCase();
	const updatedLabel = new Date(course.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
	const descParagraphs = course.courseLongDesc ?? [course.courseDesc ?? ''];
	const visibleParagraphs = showFullDesc ? descParagraphs : descParagraphs.slice(0, 2);

	return (
		<div className={'course-detail-page'}>
			<Head>
				<title>{`${course.courseTitle} — Academics`}</title>
				<meta name="description" content={course.courseDesc} />
				<meta property="og:title" content={`${course.courseTitle} — Academics`} />
				<meta property="og:description" content={course.courseDesc} />
				<meta property="og:image" content={course.courseImages?.[0]} />
				<meta property="og:type" content="website" />
			</Head>

			<nav className={'detail-breadcrumbs'} aria-label="Breadcrumb">
				<ol>
					<li>
						<Link href={'/'}>{t('Home')}</Link>
						<ChevronRightRoundedIcon aria-hidden="true" />
					</li>
					<li>
						<Link href={'/course'}>{t('Courses')}</Link>
						<ChevronRightRoundedIcon aria-hidden="true" />
					</li>
					<li>
						<Link
							href={`/course?input=${JSON.stringify({
								page: 1,
								limit: 8,
								sort: 'courseRank',
								direction: 'DESC',
								search: { categoryList: [course.courseCategory] },
							})}`}
						>
							{t(categoryLabel)}
						</Link>
						<ChevronRightRoundedIcon aria-hidden="true" />
					</li>
					<li aria-current="page">{course.courseTitle}</li>
				</ol>
			</nav>

			<div className={'detail-columns'}>
				<div className={'detail-main'}>
					<section className={'detail-hero'} aria-labelledby="course-detail-title">
						<span className={'hero-category-badge'}>{t(categoryLabel)}</span>
						<h1 id="course-detail-title">{course.courseTitle}</h1>
						<p className={'hero-short-desc'}>{course.courseDesc}</p>

						<div className={'hero-stats'}>
							<RatingDisplay
								rating={course.courseRating}
								count={course.courseReviewsCount}
								countSuffix={t('Reviews')}
							/>
							<span>
								<PeopleAltOutlinedIcon />
								{course.courseStudents} {t('Students')}
							</span>
						</div>

						<div className={'hero-instructor'}>
							<Image
								src={instructorImage}
								alt={course.memberData?.memberNick ?? 'instructor'}
								width={34}
								height={34}
								unoptimized
							/>
							<span>
								{t('Created by')}{' '}
								<Link href={{ pathname: '/instructor/detail', query: { id: course.memberId } }}>
									{course.memberData?.memberNick}
								</Link>
							</span>
						</div>

						<ul className={'hero-facts'}>
							<li>
								<UpdateOutlinedIcon />
								{t('Last updated')} {updatedLabel}
							</li>
							<li>
								<TranslateOutlinedIcon />
								{t(categoryLabel)}
							</li>
							{course.courseSubtitles?.length ? (
								<li>
									<SubtitlesOutlinedIcon />
									{t('Subtitles')}: {course.courseSubtitles.join(', ')}
								</li>
							) : null}
							<li>
								<SignalCellularAltRoundedIcon />
								<span className={'capitalize'}>{course.courseLevel.toLowerCase()}</span>
							</li>
						</ul>
					</section>

					{/* Purchase card shown here in single-column flow (tablet/mobile). */}
					<div className={'purchase-inline'}>
						<PurchaseCard course={course} onPreview={openPreview} />
					</div>

					<nav className={'detail-anchor-nav'} aria-label={t('Course sections')}>
						{ANCHOR_SECTIONS.map((section) => (
							<a key={section.id} href={`#${section.id}`}>
								{t(section.label)}
							</a>
						))}
					</nav>

					<section id="overview" className={'detail-section'} aria-labelledby="learnings-title">
						<h2 id="learnings-title">{t('What you will learn')}</h2>
						<div className={'learnings-card'}>
							<ul>
								{course.courseLearnings?.map((item) => (
									<li key={item}>
										<CheckRoundedIcon aria-hidden="true" />
										{item}
									</li>
								))}
							</ul>
						</div>
					</section>

					<section id="curriculum" className={'detail-section'} aria-labelledby="curriculum-title">
						<h2 id="curriculum-title">{t('Curriculum')}</h2>
						<p className={'section-subline'}>
							{course.courseSections?.length} {t('sections')} • {course.courseLessons} {t('Lessons')} •{' '}
							{course.courseVideoHours} {t('hours total')}
						</p>
						<CurriculumAccordion course={course} onPreview={openPreview} />
					</section>

					{course.courseRequirements?.length ? (
						<section className={'detail-section'} aria-labelledby="requirements-title">
							<h2 id="requirements-title">{t('Requirements')}</h2>
							<ul className={'requirements-list'}>
								{course.courseRequirements.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</section>
					) : null}

					<section className={'detail-section'} aria-labelledby="description-title">
						<h2 id="description-title">{t('Description')}</h2>
						<div className={'detail-description'}>
							{visibleParagraphs.map((paragraph) => (
								<p key={paragraph.slice(0, 40)}>{paragraph}</p>
							))}
						</div>
						{descParagraphs.length > 2 && (
							<button
								type="button"
								className={'show-more-btn'}
								aria-expanded={showFullDesc}
								onClick={() => setShowFullDesc((prev) => !prev)}
							>
								{showFullDesc ? t('Show less') : t('Show more')}
							</button>
						)}
					</section>

					<section id="instructor" className={'detail-section'} aria-labelledby="instructor-title">
						<h2 id="instructor-title">{t('Instructor')}</h2>
						<InstructorCard course={course} />
					</section>

					<section id="reviews" className={'detail-section'} aria-labelledby="reviews-title">
						<h2 id="reviews-title">{t('Student Reviews')}</h2>
						<CourseReviews course={course} />
					</section>
				</div>

				<aside className={'detail-aside'} aria-label={t('Enrollment')}>
					<PurchaseCard course={course} onPreview={openPreview} />
				</aside>
			</div>

			{relatedCourses.length !== 0 && (
				<section className={'related-courses'} aria-labelledby="related-title">
					<h2 id="related-title">{t('Related Courses')}</h2>
					<div className={'related-grid'}>
						{relatedCourses.map((related) => (
							<CourseCatalogCard key={related._id} course={related} onPreview={openPreview} />
						))}
					</div>
				</section>
			)}

			<FinalCta />

			{/* Mobile sticky enrollment bar. */}
			<div className={'mobile-enroll-bar'}>
				<div className={'bar-price'}>
					<PriceDisplay price={course.coursePrice} originalPrice={course.courseOriginalPrice} />
				</div>
				<Link href={'/account/login'} className={'bar-enroll-btn'}>
					{t('Enroll Now')}
				</Link>
			</div>

			<CoursePreviewModal isOpen={previewOpen} course={previewCourse} onClose={closePreview} />
		</div>
	);
};

export default withLayoutCourse(CourseDetail);
