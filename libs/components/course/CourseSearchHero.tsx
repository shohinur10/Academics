import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Course } from '../../types/course/course';
import FeaturedCourseCard from './FeaturedCourseCard';

const POPULAR_SEARCHES = ['English', 'Korean', 'Japanese', 'IELTS', 'Business English', 'TOEIC'];

interface CourseSearchHeroProps {
	initialText?: string;
	featuredCourse?: Course;
	onSearch: (text: string) => void;
	onPreview: (course: Course) => void;
}

const CourseSearchHero = ({ initialText, featuredCourse, onSearch, onPreview }: CourseSearchHeroProps) => {
	const { t } = useTranslation('common');
	const [text, setText] = useState(initialText ?? '');

	/** Keep the input in sync when the URL filter changes (e.g. back/forward navigation). **/
	useEffect(() => {
		setText(initialText ?? '');
	}, [initialText]);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(text.trim());
	};

	return (
		<section className={'course-hero'} aria-labelledby="course-hero-title">
			<div className={'course-hero-grid'}>
				<div className={'course-hero-content'}>
					<span className={'course-hero-badge'}>{t('Explore • Learn • Achieve')}</span>
					<h1 id="course-hero-title" className={'course-hero-title'}>
						{t('Find the perfect course')} <span className={'highlight'}>{t('to achieve your goals')}</span>
					</h1>
					<p className={'course-hero-subtitle'}>
						{t('Explore 500+ high-quality language courses taught by expert instructors from around the world.')}
					</p>

					<form className={'course-search-form'} role="search" onSubmit={submit}>
						<label htmlFor="course-search-input" className={'visually-hidden'}>
							{t('Course Search')}
						</label>
						<div className={'search-field'}>
							<SearchOutlinedIcon aria-hidden="true" />
							<input
								id="course-search-input"
								type="search"
								value={text}
								placeholder={t('Search courses, skills or instructors...')}
								onChange={(e) => setText(e.target.value)}
							/>
						</div>
						<button type="submit" className={'search-submit-btn'}>
							{t('Search')}
						</button>
					</form>

					<div className={'popular-pills'}>
						<span className={'pills-label'}>{t('Popular')}:</span>
						{POPULAR_SEARCHES.map((term) => (
							<button
								key={term}
								type="button"
								className={'pill'}
								onClick={() => {
									setText(term);
									onSearch(term);
								}}
							>
								{t(term)}
							</button>
						))}
					</div>
				</div>

				{featuredCourse && <FeaturedCourseCard course={featuredCourse} onPreview={onPreview} />}
			</div>
		</section>
	);
};

export default CourseSearchHero;
