import { CourseCategory, CourseLevel, CourseSkill, CourseStatus, CourseType } from '../enums/course.enum';
import { Course, CourseLesson, CourseLessonType, CourseReview, CourseSection } from '../types/course/course';
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

/** Presentation extras for the catalog UI (rating, reviews, preview video, learning outcomes). */
const COURSE_EXTRAS: Record<string, Partial<Course>> = {
	'course-1': {
		courseRating: 4.9,
		courseReviewsCount: 325,
		coursePreviewDuration: '1:32',
		courseLearnings: [
			'Hold everyday conversations with confidence',
			'Master essential grammar for daily situations',
			'Build a practical vocabulary of 1,500+ words',
			'Understand native speakers at a natural pace',
		],
	},
	'course-2': {
		courseRating: 4.9,
		courseReviewsCount: 328,
		coursePreviewDuration: '1:45',
		courseFeatured: true,
		courseLearnings: [
			'Structure Task 1 and Task 2 essays for band 7+',
			'Apply examiner-approved cohesion techniques',
			'Avoid the most common band-lowering mistakes',
			'Get personal feedback on two full essays',
		],
	},
	'course-3': {
		courseRating: 4.8,
		courseReviewsCount: 210,
		coursePreviewDuration: '1:18',
		courseLearnings: [
			'Read and write Hangul from day one',
			'Use core survival phrases in real situations',
			'Understand basic sentence structure and particles',
		],
	},
	'course-4': {
		courseRating: 4.9,
		courseReviewsCount: 189,
		coursePreviewDuration: '1:45',
		courseLearnings: [
			'Deliver persuasive presentations in English',
			'Negotiate confidently with international partners',
			'Write clear, professional business emails',
			'Lead and participate in meetings effectively',
		],
	},
	'course-5': {
		courseRating: 4.7,
		courseReviewsCount: 143,
		coursePreviewDuration: '1:05',
		courseLearnings: [
			'Solve every TOEIC question type with proven strategies',
			'Manage timing across full-length practice tests',
			'Boost your listening score with targeted drills',
		],
	},
	'course-6': {
		courseRating: 4.6,
		courseReviewsCount: 87,
		coursePreviewDuration: '1:34',
		courseLearnings: [
			'Pronounce all four Mandarin tones accurately',
			'Master the complete pinyin system',
			'Use essential vocabulary for daily life',
		],
	},
	'course-7': {
		courseRating: 4.7,
		courseReviewsCount: 98,
		coursePreviewDuration: '1:30',
		courseLearnings: [
			'Cover every JLPT N5 grammar point',
			'Reinforce learning with quizzes and flashcards',
			'Practice with live Q&A sessions each week',
		],
	},
	'course-8': {
		courseRating: 4.7,
		courseReviewsCount: 77,
		coursePreviewDuration: '1:12',
		courseLearnings: [
			'Speak naturally in weekly live sessions',
			'Learn expressions native speakers actually use',
			'Get instant pronunciation feedback from tutors',
		],
	},
};

/** Generic learning outcomes used to pad course-specific bullets up to six. */
const GENERIC_LEARNINGS = [
	'Practice with interactive exercises after every lesson',
	'Track your improvement with section quizzes',
	'Earn a certificate of completion',
];

const REQUIREMENTS_BY_LEVEL: Record<CourseLevel, string[]> = {
	[CourseLevel.BEGINNER]: ['No previous experience required — we start from zero'],
	[CourseLevel.ELEMENTARY]: ['Basic familiarity with the alphabet and common greetings'],
	[CourseLevel.INTERMEDIATE]: ['Comfortable with everyday conversations and basic grammar'],
	[CourseLevel.ADVANCED]: ['Upper-intermediate level or equivalent study experience'],
};

const lessonDuration = (seed: number): string => {
	const minutes = 5 + ((seed * 7) % 11);
	const seconds = (seed * 17) % 60;
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/** Builds a deterministic 3-section curriculum from the course lesson count. */
const buildCurriculum = (course: Course): CourseSection[] => {
	const titles = ['Introduction & Foundations', 'Core Skills & Practice', 'Real-World Application'];
	const total = Math.max(course.courseLessons, 6);
	const perSection = [Math.ceil(total * 0.25), Math.ceil(total * 0.45), 0];
	perSection[2] = total - perSection[0] - perSection[1];

	let lessonNo = 0;
	return titles.map((title, sectionIndex) => {
		const lessons: CourseLesson[] = [];
		for (let i = 0; i < perSection[sectionIndex]; i++) {
			lessonNo += 1;
			const isLast = i === perSection[sectionIndex] - 1;
			let type: CourseLessonType = 'VIDEO';
			if (isLast) type = sectionIndex === 2 ? 'ASSIGNMENT' : 'QUIZ';
			else if (i === 1 && sectionIndex === 1) type = 'READING';
			lessons.push({
				title:
					type === 'QUIZ'
						? `Section ${sectionIndex + 1} quiz`
						: type === 'ASSIGNMENT'
						? 'Final assignment & feedback'
						: type === 'READING'
						? 'Study notes & key expressions'
						: `Lesson ${lessonNo}: ${course.courseCategory.toLowerCase()} in practice`,
				duration: lessonDuration(lessonNo + course._id.length),
				type,
				// First two lessons of the course are free to preview.
				isPreview: lessonNo <= 2,
			});
		}
		return { title, lessons };
	});
};

MOCK_COURSES.forEach((course, index) => {
	Object.assign(course, COURSE_EXTRAS[course._id]);
	// Placeholder preview clip until real lesson previews are uploaded.
	course.courseVideoUrl = course.courseVideoUrl ?? '/video/ads.mov';
	// Stagger creation dates so the "Newest" sort is meaningful.
	course.createdAt = new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000);
	course.updatedAt = new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000);

	/** Detail-page data (replace with real API fields when the backend is ready). **/
	course.courseOriginalPrice = Math.round(course.coursePrice * 1.35);
	course.courseVideoHours = Math.round(course.courseLessons * 0.45 * 10) / 10;
	course.courseResourcesCount = 4 + (index % 4);
	course.courseSubtitles = ['English', 'Korean'];
	course.courseRequirements = [
		...REQUIREMENTS_BY_LEVEL[course.courseLevel],
		'A device with a stable internet connection',
		'Willingness to practice 20–30 minutes a day',
	];
	course.courseLongDesc = [
		course.courseDesc ?? '',
		`This course combines structured lessons with real conversation practice. Across ${course.courseDuration} weeks and ${course.courseLessons} lessons you will move from guided exercises to spontaneous use of the language, with feedback from your instructor at every stage.`,
		`Every module ends with a short quiz so you can check your understanding before moving on. You will also join a private community space where students share practice recordings, ask questions, and prepare for the final assignment together.`,
		`By the end of the course you will have a portfolio of completed assignments, a clear picture of your strengths, and a study plan for your next level.`,
	];
	course.courseLearnings = [...(course.courseLearnings ?? []), ...GENERIC_LEARNINGS].slice(0, 7);
	course.courseSections = buildCurriculum(course);
});

/** Placeholder review pool shared across mock courses. */
const REVIEW_POOL: Omit<CourseReview, 'id'>[] = [
	{
		memberName: 'Jisoo Han',
		memberAvatar: '/img/profile/girl.svg',
		rating: 5,
		createdAt: new Date('2026-06-28'),
		comment:
			'The lessons are short, focused and easy to follow. My speaking confidence improved noticeably within the first month.',
	},
	{
		memberName: 'Timur Alimov',
		memberAvatar: '/img/profile/agent.png',
		rating: 5,
		createdAt: new Date('2026-06-14'),
		comment:
			'Great structure and a very responsive instructor. The section quizzes really helped me find my weak points early.',
	},
	{
		memberName: 'Emily Carter',
		memberAvatar: '/img/profile/girl.svg',
		rating: 4,
		createdAt: new Date('2026-05-30'),
		comment:
			'Solid course with practical examples. I would love even more live practice sessions, but the recorded content is excellent.',
	},
	{
		memberName: 'Dilshod Rakhimov',
		memberAvatar: '/img/profile/agent.png',
		rating: 5,
		createdAt: new Date('2026-05-11'),
		comment:
			'The final assignment with personal feedback was worth the price alone. Clear explanations and a supportive community.',
	},
	{
		memberName: 'Hana Sato',
		memberAvatar: '/img/profile/girl.svg',
		rating: 4,
		createdAt: new Date('2026-04-22'),
		comment: 'Well organized and beginner friendly. The downloadable study notes are something I still use every week.',
	},
];

export const getCourseReviews = (courseId: string): CourseReview[] => {
	// Deterministic subset per course so each page shows stable, distinct reviews.
	const offset = courseId.length % 2;
	return REVIEW_POOL.slice(offset, offset + 4).map((review, index) => ({
		...review,
		id: `${courseId}-review-${index}`,
	}));
};

/** Approximate distribution (percent for 5★..1★) derived from the average rating. */
export const getRatingDistribution = (course: Course): number[] => {
	const rating = course.courseRating ?? 4.5;
	if (rating >= 4.8) return [82, 13, 3, 1, 1];
	if (rating >= 4.6) return [72, 20, 5, 2, 1];
	return [62, 25, 8, 3, 2];
};

export const getRelatedCourses = (course: Course, limit = 4): Course[] => {
	const sameCategory = MOCK_COURSES.filter(
		(c) => c._id !== course._id && c.courseCategory === course.courseCategory,
	);
	const others = MOCK_COURSES.filter((c) => c._id !== course._id && c.courseCategory !== course.courseCategory).sort(
		(a, b) => b.courseRank - a.courseRank,
	);
	return [...sameCategory, ...others].slice(0, limit);
};

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
	if (search?.durationRange) {
		result = result.filter(
			(c) => c.courseDuration >= search.durationRange!.start && c.courseDuration <= search.durationRange!.end,
		);
	}
	if (search?.minRating) {
		result = result.filter((c) => (c.courseRating ?? 0) >= search.minRating!);
	}
	if (search?.memberId) {
		result = result.filter((c) => c.memberId === search.memberId);
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

	const sort = (input.sort || 'courseRank') as keyof Course;
	const dir = input.direction === 'ASC' ? 1 : -1;
	result.sort((a, b) => {
		const aVal = (a[sort] as number | string | Date | undefined) ?? 0;
		const bVal = (b[sort] as number | string | Date | undefined) ?? 0;
		return aVal > bVal ? dir : aVal < bVal ? -dir : 0;
	});

	const start = (input.page - 1) * input.limit;
	return result.slice(start, start + input.limit);
};

export const getMockCoursesTotal = (input: CoursesInquiry): number => {
	const allInput = { ...input, page: 1, limit: 9999 };
	return filterMockCourses(allInput).length;
};
