import { CourseCategory, CourseLevel, CourseSkill, CourseStatus, CourseType } from '../../enums/course.enum';

export interface CourseUpdate {
	_id: string;
	courseType?: CourseType;
	courseStatus?: CourseStatus;
	courseLevel?: CourseLevel;
	courseCategory?: CourseCategory;
	courseSkill?: CourseSkill;
	courseTitle?: string;
	courseDesc?: string;
	coursePrice?: number;
	courseDuration?: number;
	courseImages?: string[];
	startedAt?: Date;
}
