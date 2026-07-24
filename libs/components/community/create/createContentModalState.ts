import { makeVar } from '@apollo/client';
import {
	CommunityContentType,
	CommunityCreateAction,
	mapCreateActionToType,
} from '../../../types/community/create';

export type CreateContentModalState = {
	open: boolean;
	initialType: CommunityContentType;
	initialDraft: string;
};

export const createContentModalVar = makeVar<CreateContentModalState>({
	open: false,
	initialType: 'discussion',
	initialDraft: '',
});

export const openCreateContentModal = (
	action?: CommunityCreateAction | CommunityContentType,
	draft?: string,
) => {
	createContentModalVar({
		open: true,
		initialType: mapCreateActionToType(action),
		initialDraft: draft?.trim() ?? '',
	});
};

export const closeCreateContentModal = () => {
	createContentModalVar({
		open: false,
		initialType: 'discussion',
		initialDraft: '',
	});
};
