import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Drawer, IconButton, Pagination, Stack } from '@mui/material';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import CourseSearchHero from '../../libs/components/course/CourseSearchHero';
import CategoryChips from '../../libs/components/course/CategoryChips';
import CourseFilter from '../../libs/components/course/Filter';
import CourseSortBar, { SortOption } from '../../libs/components/course/CourseSortBar';
import CourseCatalogCard from '../../libs/components/course/CourseCatalogCard';
import CoursePreviewModal from '../../libs/components/course/CoursePreviewModal';
import InstructorsStrip from '../../libs/components/course/InstructorsStrip';
import SuccessStories from '../../libs/components/course/SuccessStories';
import FeatureStrip, { FeatureItem } from '../../libs/components/homepage/FeatureStrip';
import FinalCta from '../../libs/components/course/FinalCta';
import { filterMockCourses, getMockCoursesTotal, MOCK_COURSES } from '../../libs/mock/courses.mock';
import { Course } from '../../libs/types/course/course';
import { CoursesInquiry } from '../../libs/types/course/course.input';
import { CourseCategory } from '../../libs/enums/course.enum';
import { Direction } from '../../libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const defaultInput: CoursesInquiry = {
	page: 1,
	limit: 8,
	sort: 'courseRank',
	direction: Direction.DESC,
	search: {},
};

const BENEFITS: FeatureItem[] = [
	{
		icon: <SchoolOutlinedIcon />,
		tone: 'purple',
		title: 'Expert Instructors',
		desc: 'Learn from certified and experienced instructors.',
	},
	{
		icon: <ForumOutlinedIcon />,
		tone: 'blue',
		title: 'Interactive Lessons',
		desc: 'Engaging lessons designed for real conversation.',
	},
	{
		icon: <ScheduleOutlinedIcon />,
		tone: 'pink',
		title: 'Flexible Learning',
		desc: 'Study anytime, anywhere at your own pace.',
	},
	{
		icon: <WorkspacePremiumOutlinedIcon />,
		tone: 'violet',
		title: 'Certificates',
		desc: 'Earn certificates and advance your language journey.',
	},
	{
		icon: <GroupsOutlinedIcon />,
		tone: 'orange',
		title: 'Community Support',
		desc: 'Join a global community and practice together.',
	},
	{
		icon: <AllInclusiveOutlinedIcon />,
		tone: 'green',
		title: 'Lifetime Access',
		desc: 'Revisit your lessons and materials whenever you need.',
	},
];

const CourseList: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>(
		router?.query?.input ? JSON.parse(router.query.input as string) : defaultInput,
	);
	const [courses, setCourses] = useState<Course[]>(filterMockCourses(searchFilter));
	const [total, setTotal] = useState(getMockCoursesTotal(searchFilter));
	const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

	const featuredCourse = useMemo(() => MOCK_COURSES.find((course) => course.courseFeatured), []);

	/** LIFECYCLES **/
	useEffect(() => {
		const inputObj: CoursesInquiry = router.query.input
			? JSON.parse(router.query.input as string)
			: defaultInput;
		setSearchFilter(inputObj);
		setCourses(filterMockCourses(inputObj));
		setTotal(getMockCoursesTotal(inputObj));
	}, [router.query.input]);

	/** HANDLERS **/
	const openPreview = (course: Course) => {
		setPreviewCourse(course);
		setPreviewOpen(true);
	};

	const closePreview = () => setPreviewOpen(false);

	const pushFilter = async (updated: CoursesInquiry, scroll = false) => {
		setFilterDrawerOpen(false);
		const input = JSON.stringify(updated);
		await router.push(`/course?input=${input}`, `/course?input=${input}`, { scroll });
	};

	const searchHandler = (text: string) => {
		pushFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, text: text || undefined } });
	};

	const categoryHandler = (category: CourseCategory | null) => {
		pushFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, categoryList: category ? [category] : undefined },
		});
	};

	const sortHandler = (option: SortOption) => {
		pushFilter({ ...searchFilter, page: 1, sort: option.sort, direction: option.direction });
	};

	const paginationHandler = (_: ChangeEvent<unknown>, value: number) => {
		pushFilter({ ...searchFilter, page: value });
	};

	const pageCount = Math.ceil(total / searchFilter.limit) || 1;

	return (
		<div className={'course-page'}>
			<CourseSearchHero
				initialText={searchFilter.search?.text}
				featuredCourse={featuredCourse}
				onSearch={searchHandler}
				onPreview={openPreview}
			/>

			<div className={'course-container'}>
				<CategoryChips activeCategory={searchFilter.search?.categoryList?.[0]} onSelect={categoryHandler} />

				<div className={'catalog-layout'}>
					<div className={'catalog-sidebar'}>
						<CourseFilter searchFilter={searchFilter} initialInput={defaultInput} onApply={pushFilter} />
					</div>

					<div className={'catalog-results'}>
						<div className={'catalog-toolbar'}>
							<button
								type="button"
								className={'mobile-filter-btn'}
								aria-label={t('Filter Courses')}
								onClick={() => setFilterDrawerOpen(true)}
							>
								<TuneOutlinedIcon />
								{t('Filters')}
							</button>
							<CourseSortBar
								total={total}
								sortValue={`${searchFilter.sort ?? 'courseRank'}:${searchFilter.direction ?? Direction.DESC}`}
								viewMode={viewMode}
								onSortChange={sortHandler}
								onViewModeChange={setViewMode}
							/>
						</div>

						{courses.length === 0 ? (
							<div className={'empty-list'}>
								<p>{t('No courses found')}</p>
								<button type="button" onClick={() => pushFilter(defaultInput)}>
									{t('Reset')}
								</button>
							</div>
						) : (
							<div className={`course-grid ${viewMode}`}>
								{courses.map((course) => (
									<CourseCatalogCard key={course._id} course={course} onPreview={openPreview} />
								))}
							</div>
						)}

						{courses.length !== 0 && pageCount > 1 && (
							<Stack className={'course-pagination'} alignItems="center">
								<Pagination
									count={pageCount}
									page={searchFilter.page}
									onChange={paginationHandler}
									shape="rounded"
									siblingCount={1}
									boundaryCount={1}
								/>
							</Stack>
						)}
					</div>
				</div>
			</div>

			<InstructorsStrip />
			<SuccessStories />

			<div className={'course-container benefits-wrap'}>
				<FeatureStrip items={BENEFITS} />
			</div>

			<FinalCta />

			<Drawer
				anchor="left"
				open={filterDrawerOpen}
				onClose={() => setFilterDrawerOpen(false)}
				className={'filter-drawer'}
			>
				<div className={'filter-drawer-head'}>
					<span>{t('Filter Courses')}</span>
					<IconButton aria-label={t('Close filters')} onClick={() => setFilterDrawerOpen(false)}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				<CourseFilter searchFilter={searchFilter} initialInput={defaultInput} onApply={pushFilter} />
			</Drawer>

			<CoursePreviewModal isOpen={previewOpen} course={previewCourse} onClose={closePreview} />
		</div>
	);
};

export default withLayoutCourse(CourseList);
