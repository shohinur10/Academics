import React, { useEffect } from 'react';
import Head from 'next/head';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import HomeHeader from '../homepage/HomeHeader';
import Footer from '../Footer';
import { getJwtToken, updateUserInfo } from '../../auth';
import CreateCommunityContentModal from '../community/create/CreateCommunityContentModal';
import CreateStudyGroupModal from '../community/groups/CreateStudyGroupModal';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/** Light marketplace layout: shared header + drawer, light background, footer. */
const withLayoutCourse = (Component: any, options?: { title?: string }) => {
	const pageTitle = options?.title ?? 'Courses — Academics';
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
					<title>{pageTitle}</title>
					<meta name={'title'} content={pageTitle} />
				</Head>
				<Stack id={device === 'mobile' ? 'mobile-wrap' : 'pc-wrap'} className={'home-layout course-layout'}>
					<HomeHeader />

					<Stack component="main" className={'home-main'}>
						<Component {...props} />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>

					<CreateCommunityContentModal />
					<CreateStudyGroupModal />
				</Stack>
			</>
		);
	};
	WithLayoutCourse.displayName = 'WithLayoutCourse';
	return WithLayoutCourse;
};

export default withLayoutCourse;
