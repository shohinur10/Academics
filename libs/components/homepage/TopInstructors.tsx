import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import InstructorCard from './InstructorCard';
import { MOCK_INSTRUCTORS } from '../../mock/instructors.mock';
import Link from 'next/link';

const TopInstructors = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents top-instructors'}>
				<Stack className={'container'}>
					<span>Top Instructors</span>
					<Swiper slidesPerView={'auto'} centeredSlides spaceBetween={29} modules={[Autoplay]}>
						{MOCK_INSTRUCTORS.map((instructor) => (
							<SwiperSlide key={instructor._id}>
								<InstructorCard instructor={instructor} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'top-agents top-instructors'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Top Instructors</span>
						<p>Expert teachers ready to guide your learning journey</p>
					</Box>
					<Link href="/instructor">
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Instructors</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Link>
				</Stack>
				<Stack className={'wrapper'}>
					<Box component={'div'} className={'switch-btn swiper-agents-prev'}>
						<ArrowBackIosNewIcon />
					</Box>
					<Box component={'div'} className={'card-wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							spaceBetween={29}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{ nextEl: '.swiper-agents-next', prevEl: '.swiper-agents-prev' }}
						>
							{MOCK_INSTRUCTORS.map((instructor) => (
								<SwiperSlide className={'top-agents-slide'} key={instructor._id}>
									<InstructorCard instructor={instructor} />
								</SwiperSlide>
							))}
						</Swiper>
					</Box>
					<Box component={'div'} className={'switch-btn swiper-agents-next'}>
						<ArrowBackIosNewIcon />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TopInstructors;
