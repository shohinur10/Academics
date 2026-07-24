import React, { FormEvent, useEffect, useId, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export interface SearchInputProps {
	id?: string;
	label: string;
	placeholder: string;
	value: string;
	onSubmit: (value: string) => void;
	onChange?: (value: string) => void;
	submitLabel?: string;
	className?: string;
	disabled?: boolean;
}

/** Shared Support search field — used by Help, FAQ, Notices, Requests. */
const SearchInput = ({
	id,
	label,
	placeholder,
	value,
	onSubmit,
	onChange,
	submitLabel = 'Search',
	className = 'support-search',
	disabled = false,
}: SearchInputProps) => {
	const autoId = useId();
	const inputId = id ?? autoId;
	const [draft, setDraft] = useState(value);

	useEffect(() => {
		setDraft(value);
	}, [value]);

	const submit = (event: FormEvent) => {
		event.preventDefault();
		onSubmit(draft.trim());
	};

	return (
		<form className={className} onSubmit={submit} role="search">
			<label className={'visually-hidden'} htmlFor={inputId}>
				{label}
			</label>
			<SearchRoundedIcon aria-hidden="true" />
			<input
				id={inputId}
				type="search"
				value={draft}
				onChange={(event) => {
					setDraft(event.target.value);
					onChange?.(event.target.value);
				}}
				placeholder={placeholder}
				autoComplete="off"
				disabled={disabled}
			/>
			<button type="submit" disabled={disabled}>
				{submitLabel}
			</button>
		</form>
	);
};

export default SearchInput;
