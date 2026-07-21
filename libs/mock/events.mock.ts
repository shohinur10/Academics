export interface AcademyEvent {
	eventTitle: string;
	eventType: string;
	description: string;
	imageSrc: string;
	date: string;
}

export const MOCK_EVENTS: AcademyEvent[] = [
	{
		eventTitle: 'Free English Trial Class',
		eventType: 'Open Class',
		description: 'Join a free 60-minute live session and experience our interactive teaching method firsthand.',
		imageSrc: '/img/banner/header1.svg',
		date: 'Every Saturday',
	},
	{
		eventTitle: 'IELTS Strategy Webinar',
		eventType: 'Webinar',
		description: 'Learn proven tips to boost your IELTS score from our top-rated instructors.',
		imageSrc: '/img/banner/header2.svg',
		date: 'Mar 15, 2026',
	},
	{
		eventTitle: 'Korean Culture Workshop',
		eventType: 'Workshop',
		description: 'Explore Korean culture while practicing conversational Korean in a fun group setting.',
		imageSrc: '/img/banner/header3.svg',
		date: 'Mar 22, 2026',
	},
	{
		eventTitle: 'Campus Open Day',
		eventType: 'Demo Day',
		description: 'Visit our campus, meet instructors, and get a personalized course recommendation.',
		imageSrc: '/img/banner/aboutBanner.svg',
		date: 'Apr 5, 2026',
	},
];
