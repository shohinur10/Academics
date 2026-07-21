import React, { useMemo } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import CourseCard from './CourseCard';
import Link from 'next/link';
import { filterMockCourses } from '../../mock/courses.mock';
import { Direction } from '../../enums/common.enum';

const PopularCourses = () => {
	const device = useDeviceDetect();
	const courses = useMemo(
		() =>
			filterMockCourses({
				page: 1,
				limit: 6,
				sort: 'courseStudents',
				direction: Direction.DESC,
				search: {},
			}),
		[],
	);

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties popular-courses'}>
				<Stack className={'container'}>
					<span>Popular Courses</span>
					<Swiper slidesPerView={'auto'} spaceBetween={15} modules={[Autoplay]}>
						{courses.map((course) => (
							<SwiperSlide key={course._id}>
								<CourseCard course={course} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'popular-properties popular-courses'}>
			<Stack className={'container'}>
				<div className={'info-box'}>
					<div className={'left'}>
						<span>Popular Courses</span>
						<p>Most enrolled courses this month</p>
					</div>
					<Link href="/course">
						<div className={'right'}>
							<div className={'more-box'}>
								<span>See All Courses</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</div>
					</Link>
				</div>
				<div className={'card-box'}>
					<Swiper
						slidesPerView={'auto'}
						spaceBetween={15}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{ nextEl: '.swiper-pop-next', prevEl: '.swiper-pop-prev' }}
					>
						{courses.map((course) => (
							<SwiperSlide key={course._id} style={{ width: 'auto' }}>
								<CourseCard course={course} />
							</SwiperSlide>
						))}
					</Swiper>
					<div className={'pagination-box'} style={{ display: 'none' }}>
						<span className={'swiper-pop-prev'} />
						<span className={'swiper-pop-next'} />
					</div>
				</div>
			</Stack>
		</Stack>
	);
};

export default PopularCourses;
