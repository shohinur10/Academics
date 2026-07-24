/** Community chat room types (mock/API-ready). */

export type CommunityRoomRole = 'STUDENT' | 'INSTRUCTOR' | 'MODERATOR' | 'ADMIN';

export type CommunityMessageStatus = 'pending' | 'sent' | 'failed';

export type CommunityReactionEmoji = '👍' | '❤️' | '😂' | '🎉' | '🙏';

export interface CommunityRoomMember {
	id: string;
	name: string;
	avatar: string;
	role: CommunityRoomRole;
	verified?: boolean;
	online?: boolean;
}

export interface CommunityRoomDetails {
	slug: string;
	name: string;
	icon: 'chat' | 'english' | 'korean' | 'ielts' | 'topik' | 'grammar' | 'partners' | 'business';
	description: string;
	rules: string[];
	createdAt: string;
	creatorName: string;
	onlineCount: number;
	unreadCount?: number;
	moderators: CommunityRoomMember[];
	members: CommunityRoomMember[];
	pinnedMessageIds?: string[];
}

export interface CommunityMessageReaction {
	emoji: CommunityReactionEmoji;
	count: number;
	reactedByMe: boolean;
}

export interface CommunityRoomMessage {
	id: string;
	clientId?: string;
	roomSlug: string;
	author: CommunityRoomMember;
	text: string;
	createdAt: string;
	updatedAt?: string;
	edited?: boolean;
	replyCount: number;
	parentId?: string | null;
	reactions: CommunityMessageReaction[];
	status: CommunityMessageStatus;
	deleted?: boolean;
}

export interface CommunityTypingUser {
	id: string;
	name: string;
}

export type CommunityRoomSocketEvent =
	| 'community:room:join'
	| 'community:room:leave'
	| 'community:message:create'
	| 'community:message:created'
	| 'community:message:update'
	| 'community:message:updated'
	| 'community:message:delete'
	| 'community:message:deleted'
	| 'community:reaction:toggle'
	| 'community:reaction:updated'
	| 'community:typing:start'
	| 'community:typing:stop'
	| 'community:presence:updated'
	| 'community:messages:page';
