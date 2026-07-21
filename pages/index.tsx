import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import FeaturedCourses from '../libs/components/homepage/FeaturedCourses';
import TopInstructors from '../libs/components/homepage/TopInstructors';
import UpcomingEvents from '../libs/components/homepage/UpcomingEvents';
import PopularCourses from '../libs/components/homepage/PopularCourses';
import TopCourses from '../libs/components/homepage/TopCourses';
import { Stack } from '@mui/material';
import WhyAcademics from '../libs/components/homepage/WhyAcademics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<FeaturedCourses />
				<PopularCourses />
				<WhyAcademics />
				<TopCourses />
				<TopInstructors />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<FeaturedCourses />
				<PopularCourses />
				<WhyAcademics />
				<TopCourses />
				<TopInstructors />
				<UpcomingEvents />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
