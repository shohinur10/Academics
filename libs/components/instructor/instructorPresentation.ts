import { InstructorBadge, InstructorTeachingFormat } from '../../types/member/member';

/** Shared badge labels for listing cards and profile hero. */
export const INSTRUCTOR_BADGE_LABELS: Record<InstructorBadge, string> = {
	TOP_RATED: 'Top Rated',
	POPULAR: 'Popular',
	TOP_TALENT: 'Top Talent',
	NEW: 'New',
};

/** Shared teaching-format labels for filters and profile availability. */
export const INSTRUCTOR_FORMAT_LABELS: Record<InstructorTeachingFormat, string> = {
	LIVE: 'Live Classes',
	RECORDED: 'Recorded Courses',
	PRIVATE: 'Private Tutoring',
	HYBRID: 'Hybrid',
};

/** Safely parse InstructorsInquiry JSON from the listing URL `input` query. */
export const parseInstructorsInquiry = <T extends object>(raw: unknown, fallback: T): T => {
	if (typeof raw !== 'string' || !raw.trim()) return fallback;
	try {
		const parsed = JSON.parse(raw) as T;
		return parsed && typeof parsed === 'object' ? parsed : fallback;
	} catch {
		return fallback;
	}
};
