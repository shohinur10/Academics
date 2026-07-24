/**
 * Compatibility facade — create pipeline lives in communityPosts.store.
 * Keeps existing imports working while persisting full CommunityPost records.
 */
export {
	createCommunityPost,
	getCreatedPostById,
	getCommunityPostBySlug,
	listCommunityPosts,
} from './communityPosts.store';
