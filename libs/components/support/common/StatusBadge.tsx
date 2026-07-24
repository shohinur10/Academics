import React from 'react';

export type StatusBadgeTone =
	| 'neutral'
	| 'info'
	| 'warning'
	| 'success'
	| 'danger'
	| 'purple'
	| 'maintenance'
	| 'feature'
	| 'course'
	| 'payment'
	| 'policy';

export interface StatusBadgeProps {
	label: string;
	tone?: StatusBadgeTone;
	className?: string;
}

/** Shared Support status / category badge. */
const StatusBadge = ({ label, tone = 'purple', className = '' }: StatusBadgeProps) => (
	<span className={`support-status-badge tone-${tone} ${className}`.trim()}>{label}</span>
);

export default StatusBadge;
