import React, { useEffect } from 'react';
import Head from 'next/head';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import HomeHeader from '../homepage/HomeHeader';
import Footer from '../Footer';
import { getJwtToken, updateUserInfo } from '../../auth';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/** Light layout for the Courses module: shared header + drawer, light background, footer. */
const withLayoutCourse = (Component: any) => {
	const WithLayoutCourse = (props: any) => {
		const device = useDeviceDetect();

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		return (
			<>
				<Head>
					<title>Courses — Academics</title>
					<meta name={'title'} content={`Courses — Academics`} />
				</Head>
				<Stack id={device === 'mobile' ? 'mobile-wrap' : 'pc-wrap'} className={'home-layout course-layout'}>
					<HomeHeader />

					<Stack component="main" className={'home-main'}>
						<Component {...props} />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</Stack>
			</>
		);
	};
	WithLayoutCourse.displayName = 'WithLayoutCourse';
	return WithLayoutCourse;
};

export default withLayoutCourse;
