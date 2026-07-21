import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import HeroSection from '../homepage/HeroSection';
import CourseSearchFilter from '../homepage/CourseSearchFilter';
import HomeHeader from '../homepage/HomeHeader';
import FeatureStrip from '../homepage/FeatureStrip';
import { getJwtToken, updateUserInfo } from '../../auth';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	const WithLayoutMain = (props: any) => {
		const device = useDeviceDetect();

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Academics — Learn Languages Online & Offline</title>
						<meta name={'title'} content={`Academics — Learn Languages Online & Offline`} />
					</Head>
					<Stack id="mobile-wrap" className={'home-layout'}>
						<HomeHeader />

						<HeroSection />
						<CourseSearchFilter />
						<FeatureStrip />

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Academics — Learn Languages Online & Offline</title>
						<meta name={'title'} content={`Academics — Learn Languages Online & Offline`} />
					</Head>
					<Stack id="pc-wrap" className={'home-layout'}>
						<HomeHeader />

						<Stack component="main" className={'home-main'}>
							<Stack className={'header-hero'}>
								<Stack className={'container hero-container'}>
									<HeroSection />
									<CourseSearchFilter />
									<FeatureStrip />
								</Stack>
							</Stack>

							<Stack id={'main'}>
								<Component {...props} />
							</Stack>

							<Stack id={'footer'}>
								<Footer />
							</Stack>
						</Stack>
					</Stack>
				</>
			);
		}
	};
	WithLayoutMain.displayName = 'WithLayoutMain';
	return WithLayoutMain;
};

export default withLayoutMain;
