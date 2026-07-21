import { Direction } from '../../enums/common.enum';
import { CourseCategory, CourseLevel, CourseSkill, CourseStatus, CourseType } from '../../enums/course.enum';

export interface PricesRange {
	start: number;
	end: number;
}

export interface PeriodsRange {
	start: Date;
	end: Date;
}

export interface CourseSearch {
	memberId?: string;
	categoryList?: CourseCategory[];
	typeList?: CourseType[];
	levelList?: CourseLevel[];
	skillList?: CourseSkill[];
	pricesRange?: PricesRange;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface CoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CourseSearch;
}

export interface InstructorsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		text?: string;
	};
}

export interface InstructorCoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		courseStatus?: CourseStatus;
	};
}

export interface AllCoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		courseStatus?: CourseStatus;
		courseCategory?: CourseCategory;
		text?: string;
	};
}

export interface CourseInput {
	courseType: CourseType;
	courseLevel: CourseLevel;
	courseCategory: CourseCategory;
	courseSkill?: CourseSkill;
	courseTitle: string;
	courseDesc?: string;
	coursePrice: number;
	courseDuration?: number;
	courseImages?: string[];
	startedAt?: Date;
}
