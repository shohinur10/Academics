import { userVar } from '../../apollo/store';
import { setJwtToken } from './index';

/** Clear auth token + reactive user without full-page reload. */
export const clearAuthQuiet = () => {
	if (typeof window === 'undefined') return;
	localStorage.removeItem('accessToken');
	setJwtToken('');
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberProperties: 0,
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});
};
