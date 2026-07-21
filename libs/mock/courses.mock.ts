import { CourseCategory, CourseLevel, CourseSkill, CourseStatus, CourseType } from '../enums/course.enum';
import { Course } from '../types/course/course';
import { CoursesInquiry } from '../types/course/course.input';
import { MOCK_INSTRUCTORS } from './instructors.mock';

export const MOCK_COURSES: Course[] = [
	{
		_id: 'course-1',
		courseType: CourseType.ONLINE,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.BEGINNER,
		courseCategory: CourseCategory.ENGLISH,
		courseSkill: CourseSkill.SPEAKING,
		courseTitle: 'English Speaking Foundations',
		courseDesc: 'Build confidence in everyday English conversations with interactive live sessions and guided practice.',
		coursePrice: 149,
		courseDuration: 8,
		courseLessons: 24,
		courseStudents: 186,
		courseViews: 2400,
		courseLikes: 142,
		courseComments: 38,
		courseRank: 96,
		courseImages: ['/img/banner/header1.svg'],
		memberId: 'inst-1',
		memberData: MOCK_INSTRUCTORS[0],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-2',
		courseType: CourseType.HYBRID,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.INTERMEDIATE,
		courseCategory: CourseCategory.IELTS,
		courseSkill: CourseSkill.WRITING,
		courseTitle: 'IELTS Writing Band 7+ Masterclass',
		courseDesc: 'Structured IELTS writing program with weekly mock tests, personal feedback, and proven templates.',
		coursePrice: 299,
		courseDuration: 12,
		courseLessons: 36,
		courseStudents: 124,
		courseViews: 3100,
		courseLikes: 198,
		courseComments: 52,
		courseRank: 99,
		courseImages: ['/img/banner/header2.svg'],
		memberId: 'inst-1',
		memberData: MOCK_INSTRUCTORS[0],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-3',
		courseType: CourseType.ONLINE,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.BEGINNER,
		courseCategory: CourseCategory.KOREAN,
		courseSkill: CourseSkill.GRAMMAR,
		courseTitle: 'Korean for Absolute Beginners',
		courseDesc: 'Learn Hangul, essential grammar, and survival phrases in a fun, step-by-step online course.',
		coursePrice: 129,
		courseDuration: 6,
		courseLessons: 18,
		courseStudents: 210,
		courseViews: 2800,
		courseLikes: 165,
		courseComments: 41,
		courseRank: 94,
		courseImages: ['/img/banner/header3.svg'],
		memberId: 'inst-3',
		memberData: MOCK_INSTRUCTORS[2],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-4',
		courseType: CourseType.OFFLINE,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.ADVANCED,
		courseCategory: CourseCategory.ENGLISH,
		courseSkill: CourseSkill.SPEAKING,
		courseTitle: 'Business English Intensive',
		courseDesc: 'Master presentations, negotiations, and professional email writing in an immersive classroom setting.',
		coursePrice: 399,
		courseDuration: 10,
		courseLessons: 30,
		courseStudents: 48,
		courseViews: 1900,
		courseLikes: 87,
		courseComments: 22,
		courseRank: 91,
		courseImages: ['/img/banner/aboutBanner.svg'],
		memberId: 'inst-2',
		memberData: MOCK_INSTRUCTORS[1],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-5',
		courseType: CourseType.ONLINE,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.INTERMEDIATE,
		courseCategory: CourseCategory.TOEIC,
		courseSkill: CourseSkill.LISTENING,
		courseTitle: 'TOEIC Listening & Reading 900+',
		courseDesc: 'Targeted TOEIC strategies, timed practice sets, and score-boosting techniques for working professionals.',
		coursePrice: 199,
		courseDuration: 8,
		courseLessons: 28,
		courseStudents: 156,
		courseViews: 2200,
		courseLikes: 121,
		courseComments: 35,
		courseRank: 93,
		courseImages: ['/img/banner/header1.svg'],
		memberId: 'inst-2',
		memberData: MOCK_INSTRUCTORS[1],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-6',
		courseType: CourseType.HYBRID,
		courseStatus: CourseStatus.UPCOMING,
		courseLevel: CourseLevel.BEGINNER,
		courseCategory: CourseCategory.CHINESE,
		courseSkill: CourseSkill.PHONICS,
		courseTitle: 'Mandarin Pinyin & Basics',
		courseDesc: 'Start your Chinese journey with pinyin mastery, tones, and essential vocabulary for daily use.',
		coursePrice: 159,
		courseDuration: 6,
		courseLessons: 20,
		courseStudents: 72,
		courseViews: 1500,
		courseLikes: 68,
		courseComments: 18,
		courseRank: 88,
		courseImages: ['/img/banner/header2.svg'],
		memberId: 'inst-4',
		memberData: MOCK_INSTRUCTORS[3],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-7',
		courseType: CourseType.ONLINE,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.ELEMENTARY,
		courseCategory: CourseCategory.JAPANESE,
		courseSkill: CourseSkill.GRAMMAR,
		courseTitle: 'Japanese N5 Grammar Bootcamp',
		courseDesc: 'Complete JLPT N5 grammar coverage with quizzes, flashcards, and live Q&A sessions.',
		coursePrice: 139,
		courseDuration: 8,
		courseLessons: 22,
		courseStudents: 98,
		courseViews: 1700,
		courseLikes: 79,
		courseComments: 24,
		courseRank: 90,
		courseImages: ['/img/banner/header3.svg'],
		memberId: 'inst-5',
		memberData: MOCK_INSTRUCTORS[4],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: 'course-8',
		courseType: CourseType.ONLINE,
		courseStatus: CourseStatus.ACTIVE,
		courseLevel: CourseLevel.INTERMEDIATE,
		courseCategory: CourseCategory.KOREAN,
		courseSkill: CourseSkill.SPEAKING,
		courseTitle: 'Korean Conversation Club',
		courseDesc: 'Weekly live conversation sessions with native speakers to boost fluency and natural expression.',
		coursePrice: 179,
		courseDuration: 4,
		courseLessons: 12,
		courseStudents: 134,
		courseViews: 2000,
		courseLikes: 112,
		courseComments: 29,
		courseRank: 92,
		courseImages: ['/img/banner/aboutBanner.svg'],
		memberId: 'inst-3',
		memberData: MOCK_INSTRUCTORS[2],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const getCourseById = (id: string): Course | undefined =>
	MOCK_COURSES.find((course) => course._id === id);

export const filterMockCourses = (input: CoursesInquiry): Course[] => {
	let result = [...MOCK_COURSES];
	const { search } = input;

	if (search?.categoryList?.length) {
		result = result.filter((c) => search.categoryList!.includes(c.courseCategory));
	}
	if (search?.typeList?.length) {
		result = result.filter((c) => search.typeList!.includes(c.courseType));
	}
	if (search?.levelList?.length) {
		result = result.filter((c) => search.levelList!.includes(c.courseLevel));
	}
	if (search?.pricesRange) {
		result = result.filter(
			(c) => c.coursePrice >= search.pricesRange!.start && c.coursePrice <= search.pricesRange!.end,
		);
	}
	if (search?.text) {
		const text = search.text.toLowerCase();
		result = result.filter(
			(c) =>
				c.courseTitle.toLowerCase().includes(text) ||
				c.courseDesc?.toLowerCase().includes(text) ||
				c.courseCategory.toLowerCase().includes(text),
		);
	}

	const sort = input.sort || 'courseRank';
	const dir = input.direction === 'ASC' ? 1 : -1;
	result.sort((a, b) => {
		const aVal = (a as any)[sort] ?? 0;
		const bVal = (b as any)[sort] ?? 0;
		return aVal > bVal ? dir : aVal < bVal ? -dir : 0;
	});

	const start = (input.page - 1) * input.limit;
	return result.slice(start, start + input.limit);
};

export const getMockCoursesTotal = (input: CoursesInquiry): number => {
	const allInput = { ...input, page: 1, limit: 9999 };
	return filterMockCourses(allInput).length;
};
