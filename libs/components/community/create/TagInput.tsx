import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { COMMUNITY_SUGGESTED_TAGS } from '../../../types/community/create';

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
}

const TagInput = ({ value, onChange }: TagInputProps) => {
	const { t } = useTranslation('common');
	const [query, setQuery] = useState('');

	const suggestions = useMemo(() => {
		const q = query.trim().toLowerCase();
		return COMMUNITY_SUGGESTED_TAGS.filter(
			(tag) => !value.includes(tag) && (!q || tag.toLowerCase().includes(q)),
		);
	}, [query, value]);

	const addTag = (tag: string) => {
		const next = tag.trim();
		if (!next) return;
		if (value.some((v) => v.toLowerCase() === next.toLowerCase())) return;
		onChange([...value, next]);
		setQuery('');
	};

	return (
		<div className={'create-tag-input'}>
			<label htmlFor="create-tag-search">{t('Tags')}</label>
			{value.length > 0 ? (
				<ul className={'selected-tags'}>
					{value.map((tag) => (
						<li key={tag}>
							<span>{tag}</span>
							<button type="button" aria-label={`${t('Remove')} ${tag}`} onClick={() => onChange(value.filter((v) => v !== tag))}>
								×
							</button>
						</li>
					))}
				</ul>
			) : null}
			<input
				id="create-tag-search"
				type="search"
				value={query}
				placeholder={t('Search or add tags')}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						addTag(query);
					}
				}}
			/>
			{suggestions.length > 0 ? (
				<ul className={'tag-suggestions'} role="listbox" aria-label={t('Suggested tags')}>
					{suggestions.map((tag) => (
						<li key={tag}>
							<button type="button" onClick={() => addTag(tag)}>
								{tag}
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default TagInput;
