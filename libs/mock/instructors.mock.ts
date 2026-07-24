import { Member, InstructorTeachingFormat } from '../types/member/member';
import type {
	InstructorReview,
	InstructorScheduleSlot,
	InstructorTeachingStyleItem,
	InstructorVideoItem,
} from '../types/member/member';
import { InstructorsInquiry } from '../types/member/member.input';
import { MemberAuthType, MemberStatus, MemberType } from '../enums/member.enum';
import { Direction } from '../enums/common.enum';

const baseInstructor = {
	memberStatus: MemberStatus.ACTIVE,
	memberAuthType: MemberAuthType.EMAIL,
	memberPhone: '+821012345678',
};

/**
 * Placeholder portraits until real instructor photos are uploaded.
 * Prefer agent.png / girl.svg over empty strings so the collage and cards render.
 */
const PORTRAITS = ['/img/profile/agent.png', '/img/profile/girl.svg', '/img/profile/defaultUser.svg'];

export const MOCK_INSTRUCTORS: Member[] = [
	{
		...baseInstructor,
		_id: 'inst-1',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'Sarah Kim',
		memberFullName: 'Sarah Kim',
		memberImage: PORTRAITS[1],
		memberDesc:
			'IELTS specialist with 10+ years of experience. Helped 500+ students achieve band 7+ with clear, exam-focused coaching.',
		memberTitle: 'English Specialist',
		memberLanguages: ['English', 'Korean'],
		memberExpertise: ['IELTS', 'Conversation', 'Business'],
		memberTeachingFormats: ['LIVE', 'RECORDED'],
		memberExperienceYears: 12,
		memberRating: 4.9,
		memberReviewsCount: 328,
		memberStudents: 3245,
		memberAvailability: ['Weekday', 'Evening'],
		memberNationality: 'South Korea',
		memberBadge: 'TOP_RATED',
		memberProperties: 4,
		memberArticles: 12,
		memberFollowers: 320,
		memberFollowings: 45,
		memberPoints: 980,
		memberLikes: 210,
		memberViews: 4500,
		memberComments: 89,
		memberRank: 98,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2024-01-12'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-2',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'James Park',
		memberFullName: 'James Park',
		memberImage: PORTRAITS[0],
		memberDesc: 'Native English speaker focused on business communication and TOEIC prep for working professionals.',
		memberTitle: 'Business English Coach',
		memberLanguages: ['English'],
		memberExpertise: ['Business', 'Conversation', 'Grammar'],
		memberTeachingFormats: ['LIVE', 'PRIVATE'],
		memberExperienceYears: 8,
		memberRating: 4.8,
		memberReviewsCount: 214,
		memberStudents: 1890,
		memberAvailability: ['Weekday', 'Morning'],
		memberNationality: 'United States',
		memberBadge: 'POPULAR',
		memberProperties: 3,
		memberArticles: 8,
		memberFollowers: 280,
		memberFollowings: 30,
		memberPoints: 870,
		memberLikes: 185,
		memberViews: 3800,
		memberComments: 67,
		memberRank: 95,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2024-03-20'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-3',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'Minji Lee',
		memberFullName: 'Minji Lee',
		memberImage: PORTRAITS[1],
		memberDesc: 'Korean language instructor for beginners and intermediate learners worldwide, with live conversation clubs.',
		memberTitle: 'Korean Language Instructor',
		memberLanguages: ['Korean', 'English'],
		memberExpertise: ['Conversation', 'TOPIK', 'Pronunciation'],
		memberTeachingFormats: ['LIVE', 'RECORDED', 'PRIVATE'],
		memberExperienceYears: 7,
		memberRating: 4.9,
		memberReviewsCount: 256,
		memberStudents: 2780,
		memberAvailability: ['Weekend', 'Afternoon'],
		memberNationality: 'South Korea',
		memberBadge: 'TOP_TALENT',
		memberProperties: 5,
		memberArticles: 15,
		memberFollowers: 410,
		memberFollowings: 52,
		memberPoints: 1050,
		memberLikes: 245,
		memberViews: 5200,
		memberComments: 102,
		memberRank: 97,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2023-11-05'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-4',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'David Chen',
		memberFullName: 'David Chen',
		memberImage: PORTRAITS[0],
		memberDesc: 'Mandarin teacher with HSK certification prep and conversational Chinese courses for travelers and professionals.',
		memberTitle: 'Mandarin Specialist',
		memberLanguages: ['Chinese', 'English'],
		memberExpertise: ['Conversation', 'Travel', 'Grammar'],
		memberTeachingFormats: ['RECORDED', 'LIVE'],
		memberExperienceYears: 6,
		memberRating: 4.7,
		memberReviewsCount: 142,
		memberStudents: 1120,
		memberAvailability: ['Weekday', 'Evening'],
		memberNationality: 'China',
		memberBadge: 'POPULAR',
		memberProperties: 2,
		memberArticles: 6,
		memberFollowers: 190,
		memberFollowings: 22,
		memberPoints: 720,
		memberLikes: 140,
		memberViews: 2900,
		memberComments: 45,
		memberRank: 92,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2024-06-18'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-5',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'Yuki Tanaka',
		memberFullName: 'Yuki Tanaka',
		memberImage: PORTRAITS[1],
		memberDesc: 'Japanese language expert specializing in JLPT preparation and daily conversation for beginners.',
		memberTitle: 'Japanese Language Expert',
		memberLanguages: ['Japanese', 'English'],
		memberExpertise: ['Grammar', 'Conversation', 'Pronunciation'],
		memberTeachingFormats: ['LIVE', 'RECORDED'],
		memberExperienceYears: 9,
		memberRating: 4.8,
		memberReviewsCount: 188,
		memberStudents: 1560,
		memberAvailability: ['Weekend', 'Morning'],
		memberNationality: 'Japan',
		memberBadge: 'TOP_RATED',
		memberProperties: 3,
		memberArticles: 9,
		memberFollowers: 250,
		memberFollowings: 28,
		memberPoints: 810,
		memberLikes: 168,
		memberViews: 3400,
		memberComments: 58,
		memberRank: 94,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2024-02-08'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-6',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'Emma Wilson',
		memberFullName: 'Emma Wilson',
		memberImage: PORTRAITS[1],
		memberDesc: 'Kids English and phonics teacher with a playful, structured approach for young learners and parents.',
		memberTitle: 'Kids English Teacher',
		memberLanguages: ['English'],
		memberExpertise: ['Kids', 'Pronunciation', 'Conversation'],
		memberTeachingFormats: ['LIVE', 'PRIVATE'],
		memberExperienceYears: 4,
		memberRating: 4.6,
		memberReviewsCount: 96,
		memberStudents: 840,
		memberAvailability: ['Weekday', 'Afternoon'],
		memberNationality: 'United Kingdom',
		memberBadge: 'NEW',
		memberProperties: 2,
		memberArticles: 4,
		memberFollowers: 120,
		memberFollowings: 18,
		memberPoints: 540,
		memberLikes: 90,
		memberViews: 1600,
		memberComments: 28,
		memberRank: 88,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2025-09-14'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-7',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'Pierre Dubois',
		memberFullName: 'Pierre Dubois',
		memberImage: PORTRAITS[0],
		memberDesc: 'French conversation coach helping learners sound natural for travel, study abroad, and professional life.',
		memberTitle: 'French Conversation Coach',
		memberLanguages: ['French', 'English'],
		memberExpertise: ['Conversation', 'Travel', 'Pronunciation'],
		memberTeachingFormats: ['LIVE', 'PRIVATE'],
		memberExperienceYears: 11,
		memberRating: 4.7,
		memberReviewsCount: 131,
		memberStudents: 980,
		memberAvailability: ['Weekend', 'Evening'],
		memberNationality: 'France',
		memberBadge: 'TOP_TALENT',
		memberProperties: 2,
		memberArticles: 5,
		memberFollowers: 160,
		memberFollowings: 20,
		memberPoints: 610,
		memberLikes: 110,
		memberViews: 2100,
		memberComments: 34,
		memberRank: 90,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2023-08-22'),
		updatedAt: new Date(),
	},
	{
		...baseInstructor,
		_id: 'inst-8',
		memberType: MemberType.INSTRUCTOR,
		memberNick: 'Sofia Rivera',
		memberFullName: 'Sofia Rivera',
		memberImage: PORTRAITS[1],
		memberDesc: 'Spanish instructor focused on travel Spanish and everyday conversation with cultural insights.',
		memberTitle: 'Spanish Language Instructor',
		memberLanguages: ['Spanish', 'English'],
		memberExpertise: ['Travel', 'Conversation', 'Grammar'],
		memberTeachingFormats: ['RECORDED', 'LIVE'],
		memberExperienceYears: 5,
		memberRating: 4.5,
		memberReviewsCount: 78,
		memberStudents: 720,
		memberAvailability: ['Weekday', 'Morning'],
		memberNationality: 'Spain',
		memberBadge: 'NEW',
		memberProperties: 2,
		memberArticles: 3,
		memberFollowers: 95,
		memberFollowings: 14,
		memberPoints: 480,
		memberLikes: 72,
		memberViews: 1400,
		memberComments: 21,
		memberRank: 86,
		memberBlocks: 0,
		memberWarnings: 0,
		createdAt: new Date('2025-11-02'),
		updatedAt: new Date(),
	},
];

const DEFAULT_TEACHING_STYLE: InstructorTeachingStyleItem[] = [
	{
		title: 'Student-Centered',
		description: 'Lessons adapt to your goals, pace, and preferred learning style.',
		icon: 'students',
	},
	{
		title: 'Real-Life Practice',
		description: 'Practice with authentic conversations and practical scenarios.',
		icon: 'practice',
	},
	{
		title: 'Supportive & Friendly',
		description: 'Clear feedback in a motivating, low-pressure environment.',
		icon: 'support',
	},
];

const DEFAULT_SCHEDULE: InstructorScheduleSlot[] = [
	{ day: 'Monday', blocks: ['09:00–11:00', '19:00–21:00'] },
	{ day: 'Wednesday', blocks: ['10:00–12:00', '18:00–20:00'] },
	{ day: 'Friday', blocks: ['14:00–16:00'] },
	{ day: 'Saturday', blocks: ['10:00–13:00'] },
];

/** Detail-page presentation extras kept in the mock repository (swap for API fields later). */
MOCK_INSTRUCTORS.forEach((instructor, index) => {
	instructor.memberIntroVideoUrl = instructor.memberIntroVideoUrl ?? '/video/ads.mov';
	instructor.memberTimezone = instructor.memberTimezone ?? 'KST (UTC+9)';
	instructor.memberNextAvailable = instructor.memberNextAvailable ?? 'Tomorrow, 10:00 AM';
	instructor.memberTeachingStyleLabel = instructor.memberTeachingStyleLabel ?? 'Interactive & goal-driven';
	instructor.memberTeachingStyleItems = instructor.memberTeachingStyleItems ?? DEFAULT_TEACHING_STYLE;
	instructor.memberSchedule = instructor.memberSchedule ?? DEFAULT_SCHEDULE;
	instructor.memberEducation =
		instructor.memberEducation ??
		`Certified language educator · ${instructor.memberExperienceYears ?? 5}+ years classroom & online teaching`;
	instructor.memberLongBio = instructor.memberLongBio ?? [
		instructor.memberDesc ?? '',
		`Over the years I have worked with students from beginner to advanced levels, helping them build confidence through structured lessons, live practice, and personalised feedback.`,
		`Whether you are preparing for an exam, improving workplace communication, or learning for travel, I design lessons around clear milestones so you always know what to practise next.`,
	];
	instructor.memberCertifications = instructor.memberCertifications ?? [
		{
			name: 'TESOL Certificate',
			organization: 'International TEFL Academy',
			year: 2016 + (index % 4),
		},
		{
			name: 'Advanced Teaching Diploma',
			organization: 'Academics Faculty Program',
			year: 2019 + (index % 3),
		},
	];
	const poster = instructor.memberImage || '/img/profile/defaultUser.svg';
	instructor.memberVideos = instructor.memberVideos ?? [
		{
			id: `${instructor._id}-intro`,
			title: 'Introduction',
			duration: '1:45',
			posterUrl: poster,
			videoUrl: '/video/ads.mov',
		},
		{
			id: `${instructor._id}-sample`,
			title: 'Teaching Sample',
			duration: '3:20',
			posterUrl: poster,
			videoUrl: '/video/ads.mov',
		},
		{
			id: `${instructor._id}-pronunciation`,
			title: 'Pronunciation Sample',
			duration: '2:10',
			posterUrl: poster,
			videoUrl: '/video/ads.mov',
		},
	];
});

const REVIEW_POOL: Omit<InstructorReview, 'id'>[] = [
	{
		memberName: 'Minji Han',
		memberAvatar: '/img/profile/girl.svg',
		rating: 5,
		createdAt: new Date('2026-06-20'),
		comment: 'Clear explanations and excellent feedback after every lesson. My speaking confidence improved quickly.',
	},
	{
		memberName: 'Alex Rivera',
		memberAvatar: '/img/profile/agent.png',
		rating: 5,
		createdAt: new Date('2026-06-02'),
		comment: 'Very structured and encouraging. The live practice sessions felt like real conversations.',
	},
	{
		memberName: 'Hana Sato',
		memberAvatar: '/img/profile/girl.svg',
		rating: 4,
		createdAt: new Date('2026-05-18'),
		comment: 'Great materials and a supportive teaching style. I would love even more homework options.',
	},
	{
		memberName: 'Daniel Park',
		memberAvatar: '/img/profile/agent.png',
		rating: 5,
		createdAt: new Date('2026-04-29'),
		comment: 'Professional, punctual, and genuinely invested in student progress. Highly recommended.',
	},
];

export const getInstructorReviews = (instructorId: string): InstructorReview[] => {
	const offset = instructorId.length % 2;
	return REVIEW_POOL.slice(offset, offset + 4).map((review, index) => ({
		...review,
		id: `${instructorId}-review-${index}`,
	}));
};

export const getInstructorRatingDistribution = (instructor: Member): number[] => {
	const rating = instructor.memberRating ?? 4.5;
	if (rating >= 4.8) return [82, 13, 3, 1, 1];
	if (rating >= 4.6) return [72, 20, 5, 2, 1];
	return [62, 25, 8, 3, 2];
};

export const getRelatedInstructors = (instructor: Member, limit = 4): Member[] => {
	const sameLanguage = MOCK_INSTRUCTORS.filter(
		(i) =>
			i._id !== instructor._id &&
			i.memberLanguages?.some((lang) => instructor.memberLanguages?.includes(lang)),
	);
	const others = MOCK_INSTRUCTORS.filter((i) => i._id !== instructor._id && !sameLanguage.includes(i)).sort(
		(a, b) => (b.memberRating ?? 0) - (a.memberRating ?? 0),
	);
	return [...sameLanguage, ...others].slice(0, limit);
};

export const getInstructorById = (id: string): Member | undefined =>
	MOCK_INSTRUCTORS.find((instructor) => instructor._id === id);

const matchesExperience = (years: number | undefined, ranges: string[]): boolean => {
	if (!years) return false;
	return ranges.some((range) => {
		if (range === '1-3') return years >= 1 && years <= 3;
		if (range === '3-5') return years > 3 && years <= 5;
		if (range === '5-10') return years > 5 && years <= 10;
		if (range === '10+') return years > 10;
		return false;
	});
};

/** Filters and sorts instructor mocks. Replace with GET_INSTRUCTORS when the API is wired. */
export const filterMockInstructors = (input: InstructorsInquiry): Member[] => {
	let result = [...MOCK_INSTRUCTORS];
	const { search } = input;

	if (search?.text) {
		const text = search.text.toLowerCase();
		result = result.filter(
			(i) =>
				i.memberNick.toLowerCase().includes(text) ||
				i.memberFullName?.toLowerCase().includes(text) ||
				i.memberTitle?.toLowerCase().includes(text) ||
				i.memberDesc?.toLowerCase().includes(text) ||
				i.memberLanguages?.some((l) => l.toLowerCase().includes(text)) ||
				i.memberExpertise?.some((e) => e.toLowerCase().includes(text)),
		);
	}

	if (search?.language) {
		result = result.filter((i) => i.memberLanguages?.includes(search.language!));
	}

	if (search?.expertise?.length) {
		result = result.filter((i) => search.expertise!.some((tag) => i.memberExpertise?.includes(tag)));
	}

	if (search?.minRating) {
		result = result.filter((i) => (i.memberRating ?? 0) >= search.minRating!);
	}

	if (search?.teachingFormats?.length) {
		result = result.filter((i) =>
			search.teachingFormats!.some((format) => i.memberTeachingFormats?.includes(format as InstructorTeachingFormat)),
		);
	}

	if (search?.availability) {
		result = result.filter((i) => i.memberAvailability?.includes(search.availability!));
	}

	if (search?.experienceRanges?.length) {
		result = result.filter((i) => matchesExperience(i.memberExperienceYears, search.experienceRanges!));
	}

	const sort = (input.sort || 'memberRank') as keyof Member;
	const dir = input.direction === Direction.ASC ? 1 : -1;
	result.sort((a, b) => {
		const aVal = (a[sort] as number | string | Date | undefined) ?? 0;
		const bVal = (b[sort] as number | string | Date | undefined) ?? 0;
		return aVal > bVal ? dir : aVal < bVal ? -dir : 0;
	});

	const start = (input.page - 1) * input.limit;
	return result.slice(start, start + input.limit);
};

export const getMockInstructorsTotal = (input: InstructorsInquiry): number => {
	return filterMockInstructors({ ...input, page: 1, limit: 9999 }).length;
};
