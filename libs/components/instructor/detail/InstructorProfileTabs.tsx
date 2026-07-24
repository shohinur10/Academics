import React, { KeyboardEvent, useRef } from 'react';
import { useTranslation } from 'next-i18next';

export type InstructorProfileTabId =
	| 'about'
	| 'courses'
	| 'reviews'
	| 'schedule'
	| 'videos'
	| 'certifications';

export interface InstructorProfileTab {
	id: InstructorProfileTabId;
	label: string;
	count?: number;
}

interface InstructorProfileTabsProps {
	tabs: InstructorProfileTab[];
	activeTab: InstructorProfileTabId;
	onSelect: (tabId: InstructorProfileTabId) => void;
}

/**
 * Accessible profile tablist with roving tabindex and arrow-key navigation.
 */
const InstructorProfileTabs = ({ tabs, activeTab, onSelect }: InstructorProfileTabsProps) => {
	const { t } = useTranslation('common');
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const focusTab = (index: number) => {
		const next = tabs[index];
		if (!next) return;
		onSelect(next.id);
		requestAnimationFrame(() => tabRefs.current[index]?.focus());
	};

	const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		let nextIndex = index;
		switch (event.key) {
			case 'ArrowRight':
				event.preventDefault();
				nextIndex = (index + 1) % tabs.length;
				break;
			case 'ArrowLeft':
				event.preventDefault();
				nextIndex = (index - 1 + tabs.length) % tabs.length;
				break;
			case 'Home':
				event.preventDefault();
				nextIndex = 0;
				break;
			case 'End':
				event.preventDefault();
				nextIndex = tabs.length - 1;
				break;
			default:
				return;
		}
		focusTab(nextIndex);
	};

	return (
		<nav className={'profile-tabs'} aria-label={t('Profile sections')} role="tablist">
			{tabs.map((tab, index) => {
				const selected = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						type="button"
						role="tab"
						id={`tab-${tab.id}`}
						className={selected ? 'active' : ''}
						aria-selected={selected}
						aria-controls={tab.id}
						tabIndex={selected ? 0 : -1}
						onClick={() => onSelect(tab.id)}
						onKeyDown={(event) => onKeyDown(event, index)}
					>
						{t(tab.label)}
						{typeof tab.count === 'number' ? ` (${tab.count})` : ''}
					</button>
				);
			})}
		</nav>
	);
};

export default InstructorProfileTabs;
