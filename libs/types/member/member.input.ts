import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { Direction } from '../../enums/common.enum';
import { InstructorTeachingFormat } from './member';

export interface MemberInput {
	memberNick: string;
	memberPassword: string;
	memberPhone: string;
	memberType?: MemberType;
	memberAuthType?: MemberAuthType;
}

export interface LoginInput {
	memberNick: string;
	memberPassword: string;
}

interface AISearch {
	text?: string;
	/** Language label, e.g. English / Korean. */
	language?: string;
	expertise?: string[];
	minRating?: number;
	teachingFormats?: InstructorTeachingFormat[];
	availability?: string;
	/** Experience band keys: '1-3' | '3-5' | '5-10' | '10+'. */
	experienceRanges?: string[];
}

export interface InstructorsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AISearch;
}

/** @deprecated Use InstructorsInquiry */
export type AgentsInquiry = InstructorsInquiry;

interface MISearch {
	memberStatus?: MemberStatus;
	memberType?: MemberType;
	text?: string;
}

export interface MembersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: MISearch;
}
