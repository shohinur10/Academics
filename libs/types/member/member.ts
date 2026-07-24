import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { MeLiked, TotalCounter } from '../common';
import { MeFollowed } from '../follow/follow';

/** Presentation formats for instructor marketplace UI (mock/API-ready). */
export type InstructorTeachingFormat = 'LIVE' | 'RECORDED' | 'PRIVATE' | 'HYBRID';

export type InstructorBadge = 'TOP_RATED' | 'POPULAR' | 'TOP_TALENT' | 'NEW';

export interface InstructorTeachingStyleItem {
	title: string;
	description: string;
	icon?: 'students' | 'practice' | 'support';
}

export interface InstructorScheduleSlot {
	day: string;
	blocks: string[];
}

export interface InstructorVideoItem {
	id: string;
	title: string;
	duration: string;
	posterUrl: string;
	videoUrl: string;
}

export interface InstructorCertification {
	name: string;
	organization: string;
	year: number;
	credentialUrl?: string;
}

export interface InstructorReview {
	id: string;
	memberName: string;
	memberAvatar: string;
	rating: number;
	createdAt: Date;
	comment: string;
}

export interface Member {
	_id: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberAuthType: MemberAuthType;
	memberPhone: string;
	memberNick: string;
	memberPassword?: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberProperties: number;
	memberRank: number;
	memberArticles: number;
	memberPoints: number;
	memberLikes: number;
	memberFollowers?: number;
	memberFollowings?: number;
	memberViews: number;
	memberComments: number;
	memberWarnings: number;
	memberBlocks: number;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	// Enable for authentications
	meLiked?: MeLiked[];
	meFollowed?: MeFollowed[];
	accessToken?: string;

	/** Instructor marketplace presentation fields (optional until backend supports them). */
	memberTitle?: string;
	memberLanguages?: string[];
	memberExpertise?: string[];
	memberTeachingFormats?: InstructorTeachingFormat[];
	memberExperienceYears?: number;
	memberRating?: number;
	memberReviewsCount?: number;
	memberStudents?: number;
	memberAvailability?: string[];
	memberNationality?: string;
	memberIntroVideoUrl?: string;
	memberBadge?: InstructorBadge;
	memberLongBio?: string[];
	memberEducation?: string;
	memberTeachingStyleLabel?: string;
	memberTeachingStyleItems?: InstructorTeachingStyleItem[];
	memberTimezone?: string;
	memberSchedule?: InstructorScheduleSlot[];
	memberNextAvailable?: string;
	memberVideos?: InstructorVideoItem[];
	memberCertifications?: InstructorCertification[];
}

export interface Members {
	list: Member[];
	metaCounter: TotalCounter[];
}
