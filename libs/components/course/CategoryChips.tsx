import React from 'react';
import { useTranslation } from 'next-i18next';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { CourseCategory } from '../../enums/course.enum';
import { MOCK_COURSES } from '../../mock/courses.mock';

interface CategoryItem {
	label: string;
	value: CourseCategory | null;
	icon: React.ReactNode;
	tone: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
	{
		label: 'English',
		value: CourseCategory.ENGLISH,
		icon: <img src="/img/flag/langen.png" alt="" />,
		tone: 'blue',
	},
	{
		label: 'Korean',
		value: CourseCategory.KOREAN,
		icon: <img src="/img/flag/langkr.png" alt="" />,
		tone: 'pink',
	},
	{ label: 'Japanese', value: CourseCategory.JAPANESE, icon: <TranslateOutlinedIcon />, tone: 'violet' },
	{ label: 'Chinese', value: CourseCategory.CHINESE, icon: <TranslateOutlinedIcon />, tone: 'orange' },
	{ label: 'IELTS', value: CourseCategory.IELTS, icon: <QuizOutlinedIcon />, tone: 'green' },
	{ label: 'TOEIC', value: CourseCategory.TOEIC, icon: <FactCheckOutlinedIcon />, tone: 'purple' },
];

interface CategoryChipsProps {
	activeCategory?: CourseCategory;
	onSelect: (category: CourseCategory | null) => void;
}

const CategoryChips = ({ activeCategory, onSelect }: CategoryChipsProps) => {
	const { t } = useTranslation('common');

	const countFor = (category: CourseCategory) =>
		MOCK_COURSES.filter((course) => course.courseCategory === category).length;

	return (
		<section className={'category-chips'} aria-label="Popular categories">
			{CATEGORY_ITEMS.map((item) => (
				<button
					key={item.label}
					type="button"
					className={`category-chip ${activeCategory === item.value ? 'active' : ''}`}
					aria-pressed={activeCategory === item.value}
					onClick={() => onSelect(activeCategory === item.value ? null : item.value)}
				>
					<span className={`chip-icon tone-${item.tone}`}>{item.icon}</span>
					<span className={'chip-text'}>
						<strong>{t(item.label)}</strong>
						<em>
							{countFor(item.value as CourseCategory)} {t('Courses')}
						</em>
					</span>
				</button>
			))}
			<button
				type="button"
				className={`category-chip view-all ${!activeCategory ? 'active' : ''}`}
				aria-pressed={!activeCategory}
				onClick={() => onSelect(null)}
			>
				<span className={'chip-icon tone-neutral'}>
					<GridViewOutlinedIcon />
				</span>
				<span className={'chip-text'}>
					<strong>{t('View All')}</strong>
					<em>
						{MOCK_COURSES.length} {t('Courses')}
					</em>
				</span>
			</button>
		</section>
	);
};

export default CategoryChips;
