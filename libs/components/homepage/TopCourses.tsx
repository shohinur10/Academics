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

const TopCourses = () => {
	const device = useDeviceDetect();
	const courses = useMemo(
		() =>
			filterMockCourses({
				page: 1,
				limit: 6,
				sort: 'courseRank',
				direction: Direction.DESC,
				search: {},
			}),
		[],
	);

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties top-courses'}>
				<Stack className={'container'}>
					<span>Top Courses</span>
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
		<Stack className={'top-properties top-courses'}>
			<Stack className={'container'}>
				<div className={'info-box'}>
					<div className={'left'}>
						<span className={'white'}>Top Courses</span>
						<p className={'white'}>Highest ranked by student reviews</p>
					</div>
					<div className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-top-prev'} />
							<div className={'swiper-top-pagination'}></div>
							<EastIcon className={'swiper-top-next'} />
						</div>
					</div>
				</div>
				<div className={'card-box'}>
					<Swiper
						className={'top-property-swiper'}
						slidesPerView={'auto'}
						spaceBetween={15}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{ nextEl: '.swiper-top-next', prevEl: '.swiper-top-prev' }}
						pagination={{ el: '.swiper-top-pagination' }}
					>
						{courses.map((course) => (
							<SwiperSlide key={course._id} className={'top-property-slide'}>
								<CourseCard course={course} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</Stack>
		</Stack>
	);
};

export default TopCourses;
