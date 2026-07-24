import { makeVar } from '@apollo/client';

export interface CreateStudyGroupModalState {
	open: boolean;
}

export const createStudyGroupModalVar = makeVar<CreateStudyGroupModalState>({ open: false });

export const openCreateStudyGroupModal = () => {
	createStudyGroupModalVar({ open: true });
};

export const closeCreateStudyGroupModal = () => {
	createStudyGroupModalVar({ open: false });
};
