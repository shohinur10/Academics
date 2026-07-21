import React from 'react';
import { useTranslation } from 'next-i18next';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Course, CourseLessonType } from '../../../types/course/course';

const LESSON_ICONS: Record<CourseLessonType, React.ReactNode> = {
	VIDEO: <PlayCircleOutlineRoundedIcon />,
	QUIZ: <QuizOutlinedIcon />,
	ASSIGNMENT: <AssignmentOutlinedIcon />,
	READING: <ArticleOutlinedIcon />,
};

interface CurriculumAccordionProps {
	course: Course;
	onPreview: (course: Course) => void;
}

const CurriculumAccordion = ({ course, onPreview }: CurriculumAccordionProps) => {
	const { t } = useTranslation('common');
	const sections = course.courseSections ?? [];

	return (
		<div className={'curriculum-accordion'}>
			{sections.map((section, index) => (
				<Accordion key={section.title} defaultExpanded={index === 0} disableGutters elevation={0}>
					<AccordionSummary
						expandIcon={<ExpandMoreRoundedIcon />}
						aria-controls={`curriculum-section-${index}-content`}
						id={`curriculum-section-${index}-header`}
					>
						<span className={'section-title'}>
							{t('Section')} {index + 1} — {section.title}
						</span>
						<span className={'section-count'}>
							{section.lessons.length} {t('Lessons')}
						</span>
					</AccordionSummary>
					<AccordionDetails id={`curriculum-section-${index}-content`}>
						<ul className={'lesson-list'}>
							{section.lessons.map((lesson) => (
								<li key={lesson.title} className={'lesson-row'}>
									<span className={'lesson-icon'}>{LESSON_ICONS[lesson.type]}</span>
									<span className={'lesson-title'}>{lesson.title}</span>
									{lesson.isPreview ? (
										<button
											type="button"
											className={'lesson-preview-btn'}
											aria-label={`${t('Preview Lesson')}: ${lesson.title}`}
											onClick={() => onPreview(course)}
										>
											{t('Preview')}
										</button>
									) : (
										<span className={'lesson-locked'} aria-label={t('Locked lesson')}>
											<LockOutlinedIcon />
										</span>
									)}
									<span className={'lesson-duration'}>{lesson.duration}</span>
								</li>
							))}
						</ul>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default CurriculumAccordion;
