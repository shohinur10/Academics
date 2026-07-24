import React, { ChangeEvent, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Drawer, IconButton, Pagination, Stack } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import withLayoutCourse from '../../libs/components/layout/LayoutCourse';
import InstructorSearchHero from '../../libs/components/instructor/InstructorSearchHero';
import InstructorFilter from '../../libs/components/instructor/InstructorFilter';
import InstructorSortBar, { InstructorSortOption } from '../../libs/components/instructor/InstructorSortBar';
import InstructorCatalogCard from '../../libs/components/instructor/InstructorCatalogCard';
import InstructorNotifyCta from '../../libs/components/instructor/InstructorNotifyCta';
import FeatureStrip, { FeatureItem } from '../../libs/components/homepage/FeatureStrip';
import { parseInstructorsInquiry } from '../../libs/components/instructor/instructorPresentation';
import {
	filterMockInstructors,
	getMockInstructorsTotal,
} from '../../libs/mock/instructors.mock';
import { Member } from '../../libs/types/member/member';
import { InstructorsInquiry } from '../../libs/types/member/member.input';
import { Direction } from '../../libs/enums/common.enum';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const defaultInput: InstructorsInquiry = {
	page: 1,
	limit: 8,
	sort: 'memberRank',
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
		title: 'Interactive Classes',
		desc: 'Engaging lessons designed for real conversation.',
	},
	{
		icon: <ScheduleOutlinedIcon />,
		tone: 'pink',
		title: 'Flexible Schedule',
		desc: 'Study anytime, anywhere at your own pace.',
	},
	{
		icon: <EmojiEventsOutlinedIcon />,
		tone: 'orange',
		title: 'Proven Results',
		desc: 'Track your progress and achieve your learning goals.',
	},
	{
		icon: <GroupsOutlinedIcon />,
		tone: 'violet',
		title: 'Supportive Community',
		desc: 'Join a global community and practice together.',
	},
];

const InstructorList: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<InstructorsInquiry>(defaultInput);
	const [instructors, setInstructors] = useState<Member[]>(() => filterMockInstructors(defaultInput));
	const [total, setTotal] = useState(() => getMockInstructorsTotal(defaultInput));
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		const inputObj = parseInstructorsInquiry(router.query.input, defaultInput);
		setSearchFilter(inputObj);
		setInstructors(filterMockInstructors(inputObj));
		setTotal(getMockInstructorsTotal(inputObj));
		// TODO(backend): replace mock filter with GET_INSTRUCTORS GraphQL query using inputObj
	}, [router.isReady, router.query.input]);

	/** HANDLERS **/
	const pushFilter = async (updated: InstructorsInquiry) => {
		setFilterDrawerOpen(false);
		const input = encodeURIComponent(JSON.stringify(updated));
		await router.push(`/instructor?input=${input}`, `/instructor?input=${input}`, { scroll: false });
	};

	const searchHandler = (text: string) => {
		pushFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, text: text || undefined } });
	};

	const sortHandler = (option: InstructorSortOption) => {
		pushFilter({ ...searchFilter, page: 1, sort: option.sort, direction: option.direction });
	};

	const paginationHandler = (_: ChangeEvent<unknown>, value: number) => {
		pushFilter({ ...searchFilter, page: value });
	};

	const pageCount = Math.ceil(total / searchFilter.limit) || 1;

	return (
		<div className={'instructor-page'}>
			<InstructorSearchHero />

			<div className={'instructor-container'}>
				<InstructorSortBar
					total={total}
					initialText={searchFilter.search?.text}
					sortValue={`${searchFilter.sort ?? 'memberRank'}:${searchFilter.direction ?? Direction.DESC}`}
					viewMode={viewMode}
					onSearch={searchHandler}
					onSortChange={sortHandler}
					onViewModeChange={setViewMode}
					onOpenFilters={() => setFilterDrawerOpen(true)}
				/>

				<div className={'instructor-catalog-layout'}>
					<aside className={'instructor-sidebar'}>
						<InstructorFilter searchFilter={searchFilter} initialInput={defaultInput} onApply={pushFilter} />
					</aside>

					<div className={'instructor-results'}>
						{instructors.length === 0 ? (
							<div className={'empty-list'}>
								<p>{t('No instructors found')}</p>
								<button type="button" onClick={() => pushFilter(defaultInput)}>
									{t('Reset')}
								</button>
							</div>
						) : (
							<div className={`instructor-grid ${viewMode}`} role="list">
								{instructors.map((instructor) => (
									<div key={instructor._id} role="listitem">
										<InstructorCatalogCard instructor={instructor} />
									</div>
								))}
							</div>
						)}

						{instructors.length !== 0 && pageCount > 1 && (
							<Stack className={'instructor-pagination'} alignItems="center">
								<Pagination
									count={pageCount}
									page={searchFilter.page}
									onChange={paginationHandler}
									shape="rounded"
									siblingCount={1}
									boundaryCount={1}
									aria-label={t('Instructors pagination')}
									getItemAriaLabel={(type, page, selected) => {
										if (type === 'page') {
											return selected ? `${t('Page')} ${page}` : `${t('Go to page')} ${page}`;
										}
										if (type === 'next') return t('Go to next page');
										if (type === 'previous') return t('Go to previous page');
										return `${type}`;
									}}
								/>
							</Stack>
						)}
					</div>
				</div>
			</div>

			<div className={'instructor-container benefits-wrap'}>
				<FeatureStrip items={BENEFITS} />
			</div>

			<InstructorNotifyCta />

			<Drawer
				anchor="left"
				open={filterDrawerOpen}
				onClose={() => setFilterDrawerOpen(false)}
				className={'instructor-filter-drawer'}
				ModalProps={{ keepMounted: true }}
			>
				<div className={'filter-drawer-head'}>
					<span id="instructor-filter-drawer-title">{t('Filter Instructors')}</span>
					<IconButton aria-label={t('Close filters')} onClick={() => setFilterDrawerOpen(false)}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>
				<InstructorFilter searchFilter={searchFilter} initialInput={defaultInput} onApply={pushFilter} />
			</Drawer>
		</div>
	);
};

export default withLayoutCourse(InstructorList, { title: 'Instructors — Academics' });
