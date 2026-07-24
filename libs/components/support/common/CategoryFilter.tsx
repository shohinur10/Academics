import React from 'react';

export interface CategoryFilterOption<T extends string = string> {
	id: T;
	label: string;
	count?: number;
}

export interface CategoryFilterProps<T extends string = string> {
	options: CategoryFilterOption<T>[];
	value: T;
	onChange: (value: T) => void;
	ariaLabel: string;
	variant?: 'chips' | 'list';
	className?: string;
}

/** Shared Support category filter — chips or vertical list. */
function CategoryFilter<T extends string = string>({
	options,
	value,
	onChange,
	ariaLabel,
	variant = 'chips',
	className,
}: CategoryFilterProps<T>) {
	const rootClass =
		className ?? (variant === 'list' ? 'support-category-list' : 'support-category-chips');

	return (
		<div className={rootClass} role="toolbar" aria-label={ariaLabel}>
			{options.map((option) => {
				const active = value === option.id;
				return (
					<button
						key={option.id}
						type="button"
						className={active ? 'support-category-item active' : 'support-category-item'}
						aria-pressed={active}
						aria-current={active ? 'true' : undefined}
						onClick={() => onChange(option.id)}
					>
						<span>{option.label}</span>
						{typeof option.count === 'number' ? (
							<span className={'support-category-count'}>{option.count}</span>
						) : null}
					</button>
				);
			})}
		</div>
	);
}

export default CategoryFilter;
