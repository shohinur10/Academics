import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface SupportCardProps {
	href?: string;
	title: string;
	excerpt?: string;
	meta?: ReactNode;
	badge?: ReactNode;
	footer?: ReactNode;
	compact?: boolean;
	className?: string;
	as?: 'article' | 'div';
	children?: ReactNode;
}

/** Shared Support card shell for FAQ, notices, requests, and Help Center strips. */
const SupportCard = ({
	href,
	title,
	excerpt,
	meta,
	badge,
	footer,
	compact = false,
	className = '',
	as = 'article',
	children,
}: SupportCardProps) => {
	const Tag = as;
	const body = (
		<>
			{(badge || meta) && (
				<div className={'support-card-top'}>
					{badge}
					{meta}
				</div>
			)}
			{href ? (
				<h3 className={'support-card-title'}>
					<Link href={href}>{title}</Link>
				</h3>
			) : (
				<h3 className={'support-card-title'}>{title}</h3>
			)}
			{!compact && excerpt ? <p className={'support-card-excerpt'}>{excerpt}</p> : null}
			{children}
			{footer ? <div className={'support-card-footer'}>{footer}</div> : null}
		</>
	);

	return (
		<Tag className={['support-card', compact ? 'compact' : '', className].filter(Boolean).join(' ')}>
			{body}
		</Tag>
	);
};

export default SupportCard;
