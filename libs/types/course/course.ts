import { CourseCategory, CourseLevel, CourseSkill, CourseStatus, CourseType } from '../../enums/course.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../common';

export type CourseLessonType = 'VIDEO' | 'QUIZ' | 'ASSIGNMENT' | 'READING';

export interface CourseLesson {
	title: string;
	duration: string;
	type: CourseLessonType;
	isPreview?: boolean;
}

export interface CourseSection {
	title: string;
	lessons: CourseLesson[];
}

export interface CourseReview {
	id: string;
	memberName: string;
	memberAvatar: string;
	rating: number;
	createdAt: Date;
	comment: string;
}

export interface Course {
	_id: string;
	courseType: CourseType;
	courseStatus: CourseStatus;
	courseLevel: CourseLevel;
	courseCategory: CourseCategory;
	courseSkill?: CourseSkill;
	courseTitle: string;
	courseDesc?: string;
	coursePrice: number;
	courseDuration: number;
	courseLessons: number;
	courseStudents: number;
	courseViews: number;
	courseLikes: number;
	courseComments: number;
	courseRank: number;
	courseImages: string[];
	courseRating?: number;
	courseReviewsCount?: number;
	courseVideoUrl?: string;
	coursePreviewDuration?: string;
	courseFeatured?: boolean;
	/** Learning-outcome bullets shown in the preview modal and detail page. */
	courseLearnings?: string[];
	courseOriginalPrice?: number;
	/** Total on-demand video hours. */
	courseVideoHours?: number;
	courseResourcesCount?: number;
	courseSubtitles?: string[];
	courseRequirements?: string[];
	/** Long description paragraphs (plain text, no HTML). */
	courseLongDesc?: string[];
	courseSections?: CourseSection[];
	memberId: string;
	startedAt?: Date;
	closedAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	memberData?: Member;
	meLiked?: MeLiked[];
}

export interface Courses {
	list: Course[];
	metaCounter: TotalCounter[];
}

