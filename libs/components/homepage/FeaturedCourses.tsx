import React, { useMemo } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import CourseCard from './CourseCard';
import { filterMockCourses } from '../../mock/courses.mock';
import { Direction } from '../../enums/common.enum';

const FeaturedCourses = () => {
	const device = useDeviceDetect();
	const courses = useMemo(
		() =>
			filterMockCourses({
				page: 1,
				limit: 8,
				sort: 'courseLikes',
				direction: Direction.DESC,
				search: {},
			}),
		[],
	);

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties featured-courses'}>
				<Stack className={'container'}>
					<div className={'info-box'}>
						<span>Featured Courses</span>
					</div>
					<div className={'card-box'}>
						<Swiper
							className={'trend-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{courses.map((course) => (
								<SwiperSlide key={course._id} className={'trend-property-slide'}>
									<CourseCard course={course} />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trend-properties featured-courses'}>
			<Stack className={'container'}>
				<div className={'info-box'}>
					<div className={'left'}>
						<span>Featured Courses</span>
						<p>Top-rated courses loved by our students</p>
					</div>
					<div className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-trend-prev'} />
							<div className={'swiper-trend-pagination'}></div>
							<EastIcon className={'swiper-trend-next'} />
						</div>
					</div>
				</div>
				<div className={'card-box'}>
					<Swiper
						className={'trend-property-swiper'}
						slidesPerView={'auto'}
						spaceBetween={15}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{ nextEl: '.swiper-trend-next', prevEl: '.swiper-trend-prev' }}
						pagination={{ el: '.swiper-trend-pagination' }}
					>
						{courses.map((course) => (
							<SwiperSlide key={course._id} className={'trend-property-slide'}>
								<CourseCard course={course} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</Stack>
		</Stack>
	);
};

export default FeaturedCourses;
