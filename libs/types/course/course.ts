import { CourseCategory, CourseLevel, CourseSkill, CourseStatus, CourseType } from '../../enums/course.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../common';

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

