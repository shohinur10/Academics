import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
	StudyGroupAnnouncement,
	StudyGroupDetails,
	StudyGroupEvent,
	StudyGroupMember,
	StudyGroupMembershipState,
	StudyGroupResource,
	StudyGroupResourceKind,
} from '../../../types/community/group';
import { canModerateGroup } from '../../../mock/communityGroups.store';

interface SectionProps {
	group: StudyGroupDetails;
	membership: StudyGroupMembershipState;
}

export const GroupAboutSection = ({ group }: { group: StudyGroupDetails }) => {
	const { t } = useTranslation('common');
	return (
		<section className={'group-section'} aria-labelledby="group-about-heading">
			<h2 id="group-about-heading">{t('About')}</h2>
			<p>{group.about}</p>
			<dl className={'group-about-meta'}>
				<div>
					<dt>{t('Language')}</dt>
					<dd>{group.language}</dd>
				</div>
				<div>
					<dt>{t('Level')}</dt>
					<dd>{t(group.level)}</dd>
				</div>
				<div>
					<dt>{t('Goal')}</dt>
					<dd>{t(group.goal)}</dd>
				</div>
				<div>
					<dt>{t('Member limit')}</dt>
					<dd>{group.memberLimit}</dd>
				</div>
			</dl>
		</section>
	);
};

export const GroupAnnouncementsSection = ({
	group,
	membership,
	onPost,
}: SectionProps & {
	onPost: (title: string, body: string) => Promise<void>;
}) => {
	const { t } = useTranslation('common');
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [busy, setBusy] = useState(false);
	const canPost = canModerateGroup(membership);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !body.trim() || busy) return;
		setBusy(true);
		try {
			await onPost(title.trim(), body.trim());
			setTitle('');
			setBody('');
		} finally {
			setBusy(false);
		}
	};

	return (
		<section className={'group-section'} aria-labelledby="group-ann-heading">
			<h2 id="group-ann-heading">{t('Announcements')}</h2>
			{canPost ? (
				<form className={'group-inline-form'} onSubmit={submit}>
					<label htmlFor="ann-title">{t('Title')}</label>
					<input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} />
					<label htmlFor="ann-body">{t('Announcement')}</label>
					<textarea id="ann-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
					<button type="submit" disabled={busy}>
						{busy ? t('Posting…') : t('Post announcement')}
					</button>
				</form>
			) : null}
			{group.announcements.length === 0 ? (
				<p className={'empty-note'}>{t('No announcements yet.')}</p>
			) : (
				<ul className={'announcement-list'}>
					{group.announcements.map((item: StudyGroupAnnouncement) => (
						<li key={item.id}>
							<h3>{item.title}</h3>
							<p>{item.body}</p>
							<p className={'meta'}>
								{item.authorName} · {new Date(item.createdAt).toLocaleDateString()}
							</p>
						</li>
					))}
				</ul>
			)}
		</section>
	);
};

export const GroupResourcesSection = ({
	group,
	membership,
	onAdd,
}: SectionProps & {
	onAdd: (resource: { title: string; kind: StudyGroupResourceKind; url: string; description: string }) => Promise<void>;
}) => {
	const { t } = useTranslation('common');
	const canManage = canModerateGroup(membership);
	const [title, setTitle] = useState('');
	const [kind, setKind] = useState<StudyGroupResourceKind>('Link');
	const [url, setUrl] = useState('');
	const [description, setDescription] = useState('');
	const [busy, setBusy] = useState(false);

	const kinds: StudyGroupResourceKind[] = ['PDF', 'Vocabulary List', 'Link', 'Lesson Notes', 'Video'];

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || busy) return;
		setBusy(true);
		try {
			await onAdd({ title: title.trim(), kind, url: url.trim(), description: description.trim() });
			setTitle('');
			setUrl('');
			setDescription('');
		} finally {
			setBusy(false);
		}
	};

	return (
		<section className={'group-section'} aria-labelledby="group-res-heading">
			<h2 id="group-res-heading">{t('Resources')}</h2>
			{canManage ? (
				<form className={'group-inline-form'} onSubmit={submit}>
					<label htmlFor="res-title">{t('Title')}</label>
					<input id="res-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
					<label htmlFor="res-kind">{t('Resource type')}</label>
					<select id="res-kind" value={kind} onChange={(e) => setKind(e.target.value as StudyGroupResourceKind)}>
						{kinds.map((k) => (
							<option key={k} value={k}>
								{t(k)}
							</option>
						))}
					</select>
					<label htmlFor="res-url">{t('URL')}</label>
					<input id="res-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
					<label htmlFor="res-desc">{t('Description')}</label>
					<input id="res-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
					<button type="submit" disabled={busy}>
						{busy ? t('Adding…') : t('Add resource')}
					</button>
				</form>
			) : null}
			{group.resources.length === 0 ? (
				<p className={'empty-note'}>{t('No shared resources yet.')}</p>
			) : (
				<ul className={'resource-list'}>
					{group.resources.map((item: StudyGroupResource) => (
						<li key={item.id}>
							<span className={'kind-badge'}>{t(item.kind)}</span>
							<div>
								{item.url ? (
									<a href={item.url} target="_blank" rel="noopener noreferrer">
										{item.title}
									</a>
								) : (
									<strong>{item.title}</strong>
								)}
								{item.description ? <p>{item.description}</p> : null}
								<p className={'meta'}>
									{item.addedBy} · {new Date(item.addedAt).toLocaleDateString()}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
};

export const GroupEventsSection = ({ group }: { group: StudyGroupDetails }) => {
	const { t } = useTranslation('common');
	const label = (type: StudyGroupEvent['type']) => {
		switch (type) {
			case 'speaking':
				return t('Speaking session');
			case 'study_meeting':
				return t('Study meeting');
			case 'webinar':
				return t('Webinar');
			case 'mock_test':
				return t('Mock test');
			default:
				return type;
		}
	};

	return (
		<section className={'group-section'} aria-labelledby="group-events-heading">
			<h2 id="group-events-heading">{t('Events')}</h2>
			{group.events.length === 0 ? (
				<p className={'empty-note'}>{t('No upcoming events.')}</p>
			) : (
				<ul className={'event-list'}>
					{group.events.map((event) => (
						<li key={event.id}>
							<span className={'kind-badge'}>{label(event.type)}</span>
							<div>
								<strong>{event.title}</strong>
								<p className={'meta'}>{event.datetimeLabel}</p>
								{event.description ? <p>{event.description}</p> : null}
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
};

export const GroupMembersSection = ({
	group,
	membership,
	onApprove,
	onRemove,
	onPromote,
}: SectionProps & {
	onApprove: (memberId: string) => Promise<void>;
	onRemove: (memberId: string) => Promise<void>;
	onPromote: (memberId: string) => Promise<void>;
}) => {
	const { t } = useTranslation('common');
	const canMod = canModerateGroup(membership);

	return (
		<section className={'group-section'} aria-labelledby="group-members-heading">
			<h2 id="group-members-heading">{t('Members')}</h2>
			<ul className={'member-list'}>
				{group.members.map((member: StudyGroupMember) => (
					<li key={member.id} className={member.online ? 'is-online' : ''}>
						<img src={member.avatar} alt="" />
						<div className={'member-info'}>
							<strong>
								{member.name}
								{member.online ? <span className={'online-dot'} aria-label={t('Online')} /> : null}
							</strong>
							<p className={'meta'}>
								{t(member.role)}
								{member.pending ? ` · ${t('Pending')}` : ''} · {t('Joined')}{' '}
								{new Date(member.joinedAt).toLocaleDateString()} · {t(member.contributionLevel)} {t('contribution')}
							</p>
						</div>
						{canMod && member.role !== 'owner' ? (
							<div className={'member-actions'}>
								{member.pending ? (
									<button type="button" onClick={() => void onApprove(member.id)}>
										{t('Approve')}
									</button>
								) : null}
								{membership === 'owner' && member.role === 'member' && !member.pending ? (
									<button type="button" onClick={() => void onPromote(member.id)}>
										{t('Make moderator')}
									</button>
								) : null}
								<button type="button" className={'danger'} onClick={() => void onRemove(member.id)}>
									{t('Remove')}
								</button>
							</div>
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
};

export const GroupRulesSection = ({ group }: { group: StudyGroupDetails }) => {
	const { t } = useTranslation('common');
	return (
		<section className={'group-section'} aria-labelledby="group-rules-heading">
			<h2 id="group-rules-heading">{t('Rules')}</h2>
			<ol className={'rules-list'}>
				{group.rules.map((rule) => (
					<li key={rule}>{rule}</li>
				))}
			</ol>
		</section>
	);
};

export const GroupModerationBar = ({
	membership,
	onEdit,
	onDelete,
}: {
	membership: StudyGroupMembershipState;
	onEdit: () => void;
	onDelete: () => void;
}) => {
	const { t } = useTranslation('common');
	if (!canModerateGroup(membership)) return null;
	return (
		<div className={'group-mod-bar'} role="region" aria-label={t('Moderation')}>
			<button type="button" onClick={onEdit}>
				{t('Edit group')}
			</button>
			{membership === 'owner' ? (
				<button type="button" className={'danger'} onClick={onDelete}>
					{t('Delete group')}
				</button>
			) : null}
		</div>
	);
};
