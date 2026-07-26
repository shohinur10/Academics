import React, { KeyboardEvent } from 'react';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { RegisterRole } from '../../types/auth/register';

interface RoleSelectCardsProps {
	value: RegisterRole;
	onChange: (role: RegisterRole) => void;
	error?: string;
	disabled?: boolean;
}

const ROLES: { id: RegisterRole; title: string; description: string; Icon: typeof SchoolOutlinedIcon }[] = [
	{
		id: 'student',
		title: 'Student',
		description: 'Learn new languages and achieve your goals.',
		Icon: AutoStoriesOutlinedIcon,
	},
	{
		id: 'instructor',
		title: 'Instructor',
		description: 'Teach students and share your knowledge.',
		Icon: SchoolOutlinedIcon,
	},
];

const RoleSelectCards = ({ value, onChange, error, disabled }: RoleSelectCardsProps) => {
	const errorId = 'register-role-error';

	const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: RegisterRole) => {
		if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
			return;
		}
		event.preventDefault();
		const index = ROLES.findIndex((role) => role.id === current);
		const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
		const next = ROLES[(index + delta + ROLES.length) % ROLES.length];
		onChange(next.id);
		const nextButton = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
			`[data-role="${next.id}"]`,
		);
		nextButton?.focus();
	};

	return (
		<fieldset className={`auth-role-fieldset ${error ? 'is-error' : ''}`} disabled={disabled}>
			<legend className="auth-field-label">I want to join as</legend>
			<div
				className="auth-role-grid"
				role="radiogroup"
				aria-label="Account role"
				aria-describedby={error ? errorId : undefined}
			>
				{ROLES.map(({ id, title, description, Icon }) => {
					const selected = value === id;
					return (
						<button
							key={id}
							type="button"
							role="radio"
							data-role={id}
							aria-checked={selected}
							tabIndex={selected ? 0 : -1}
							className={`auth-role-card ${selected ? 'is-selected' : ''}`}
							onClick={() => onChange(id)}
							onKeyDown={(event) => onKeyDown(event, id)}
						>
							<span className="auth-role-icon" aria-hidden="true">
								<Icon fontSize="small" />
							</span>
							<span className="auth-role-title">{title}</span>
							<span className="auth-role-desc">{description}</span>
						</button>
					);
				})}
			</div>
			{error ? (
				<span id={errorId} className="auth-field-error" role="alert">
					{error}
				</span>
			) : null}
		</fieldset>
	);
};

export default RoleSelectCards;
