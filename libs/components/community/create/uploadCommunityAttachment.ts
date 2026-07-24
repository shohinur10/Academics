import { getJwtToken } from '../../../auth';
import { REACT_APP_API_URL } from '../../../config';
import {
	CommunityAttachment,
	COMMUNITY_MAX_ATTACHMENT_BYTES,
	COMMUNITY_SAFE_ATTACHMENT_TYPES,
} from '../../../types/community/create';
import axios from 'axios';

const isSafeType = (mime: string) =>
	(COMMUNITY_SAFE_ATTACHMENT_TYPES as readonly string[]).includes(mime) || mime.startsWith('image/');

export const uploadCommunityAttachment = async (
	file: File,
	onProgress: (progress: number) => void,
): Promise<CommunityAttachment> => {
	const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
	const base: CommunityAttachment = {
		id,
		name: file.name,
		mimeType: file.type || 'application/octet-stream',
		size: file.size,
		progress: 0,
		status: 'uploading',
	};

	if (!isSafeType(base.mimeType)) {
		return {
			...base,
			progress: 100,
			status: 'failure',
			error: 'Unsupported file type',
		};
	}

	if (file.size > COMMUNITY_MAX_ATTACHMENT_BYTES) {
		return {
			...base,
			progress: 100,
			status: 'failure',
			error: 'File exceeds 10MB limit',
		};
	}

	const token = getJwtToken();
	const isImage = base.mimeType.startsWith('image/');

	if (isImage && token && process.env.REACT_APP_API_GRAPHQL_URL) {
		try {
			onProgress(15);
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target)
					}`,
					variables: { file: null, target: 'article' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', file);
			onProgress(45);
			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});
			onProgress(100);
			const path = response.data?.data?.imageUploader;
			if (!path) throw new Error('Upload failed');
			return {
				...base,
				progress: 100,
				status: 'success',
				url: `${REACT_APP_API_URL}/${path}`,
			};
		} catch {
			return {
				...base,
				progress: 100,
				status: 'failure',
				error: 'Upload failed',
			};
		}
	}

	/* Local preview only when GraphQL upload is unavailable — not server persistence. */
	onProgress(40);
	await new Promise((r) => setTimeout(r, 200));
	onProgress(100);
	return {
		...base,
		progress: 100,
		status: 'success',
		url: URL.createObjectURL(file),
	};
};
