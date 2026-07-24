import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import withLayoutCourse from '../../../libs/components/layout/LayoutCourse';
import {
	PostArticleHeader,
	PostBody,
	PollPanel,
	ResourcePanel,
	SuccessPanel,
	RelatedContent,
	ReportDialog,
} from '../../../libs/components/community/detail/PostPanels';
import ThreadedReplies from '../../../libs/components/community/detail/ThreadedReplies';
import { userVar } from '../../../apollo/store';
import { MemberType } from '../../../libs/enums/member.enum';
import { REACT_APP_API_URL } from '../../../libs/config';
import { CommunityPostAuthor, CommunityPostRole } from '../../../libs/types/community/post';
import { COMMUNITY_POST_SLUGS } from '../../../libs/mock/communityPosts.mock';
import {
	castPollVote,
	communityPostsRevisionVar,
	deleteCommunityPost,
	getCommunityPostBySlug,
	getRelatedPosts,
	moderateCommunityPost,
	togglePostBookmark,
	togglePostReaction,
	updateCommunityPost,
} from '../../../libs/mock/communityPosts.store';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const paths = (locales ?? ['en']).flatMap((locale) =>
		COMMUNITY_POST_SLUGS.map((slug) => ({ params: { slug }, locale })),
	);
	return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

const resolveAvatar = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const mapRole = (memberType?: string): CommunityPostRole => {
	if (memberType === MemberType.ADMIN) return 'ADMIN';
	if (memberType === MemberType.INSTRUCTOR) return 'INSTRUCTOR';
	return 'STUDENT';
};

const CommunityPostDetailPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
	const user = useReactiveVar(userVar);
	const revision = useReactiveVar(communityPostsRevisionVar);

	const [ready, setReady] = useState(false);
	const [busy, setBusy] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);
	const [reportTarget, setReportTarget] = useState<'post' | string>('post');

	useEffect(() => {
		setReady(true);
	}, []);

	const post = useMemo(() => {
		void revision;
		if (!ready || !slug) return null;
		return getCommunityPostBySlug(slug);
	}, [ready, slug, revision]);

	const related = useMemo(() => (post ? getRelatedPosts(post) : []), [post, revision]);

	const selfAuthor: CommunityPostAuthor | null = useMemo(() => {
		if (!user?._id) return null;
		return {
			id: user._id,
			name: user.memberNick || 'You',
			avatar: resolveAvatar(user.memberImage),
			role: mapRole(user.memberType),
		};
	}, [user]);

	const isModerator = user?.memberType === MemberType.ADMIN;
	const isAuthor = Boolean(post && selfAuthor && post.author.id === selfAuthor.id);

	if (!ready) {
		return (
			<div className={'community-post-page'}>
				<p className={'loading-note'}>{t('Loading…')}</p>
			</div>
		);
	}

	if (!post || post.hidden) {
		return (
			<div className={'community-stub-page'}>
				<div className={'community-stub-card'}>
					<h1>{t('Post not found')}</h1>
					<p>{t('This discussion may have been removed or hidden.')}</p>
					<Link href="/community" className={'stub-btn'}>
						{t('Back to Community')}
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className={'community-post-page'}>
			<div className={'community-post-layout'}>
				<article className={'community-post-article'}>
					<PostArticleHeader
						post={post}
						isAuthor={isAuthor}
						isModerator={isModerator}
						onReact={async (emoji) => {
							if (!selfAuthor) {
								await sweetMixinErrorAlert(t('Sign in to react.'));
								return;
							}
							await togglePostReaction({ slug: post.slug, emoji, userId: selfAuthor.id });
						}}
						onBookmark={async () => {
							if (!selfAuthor) {
								await sweetMixinErrorAlert(t('Sign in to bookmark.'));
								return;
							}
							const result = await togglePostBookmark({ slug: post.slug, userId: selfAuthor.id });
							if (result.ok) {
								await sweetTopSuccessAlert(result.data ? t('Bookmarked') : t('Bookmark removed'));
							}
						}}
						onShare={async () => {
							const url = window.location.href;
							try {
								await navigator.clipboard.writeText(url);
								await sweetTopSuccessAlert(t('Link copied'));
							} catch {
								await sweetTopSuccessAlert(t('Unable to copy link'));
							}
						}}
						onReport={() => {
							setReportTarget('post');
							setReportOpen(true);
						}}
						onEdit={async () => {
							if (!selfAuthor) return;
							const title = window.prompt(t('Title'), post.title);
							if (title === null) return;
							const body = window.prompt(t('Body'), post.body);
							if (body === null) return;
							const result = await updateCommunityPost({
								slug: post.slug,
								actorId: selfAuthor.id,
								isModerator,
								patch: { title: title.trim() || post.title, body: body.trim() || post.body },
							});
							if (!result.ok) await sweetMixinErrorAlert(t(result.error));
							else await sweetTopSuccessAlert(t('Post updated.'));
						}}
						onDelete={async () => {
							if (!selfAuthor) return;
							const confirmed = window.confirm(t('Delete this post?'));
							if (!confirmed) return;
							const result = await deleteCommunityPost({
								slug: post.slug,
								actorId: selfAuthor.id,
								isModerator,
							});
							if (!result.ok) {
								await sweetMixinErrorAlert(t(result.error));
								return;
							}
							await router.push('/community');
						}}
						onModerate={async (action) => {
							const result = await moderateCommunityPost({ slug: post.slug, action, isModerator });
							if (!result.ok) await sweetMixinErrorAlert(t(result.error));
						}}
					/>

					{post.type === 'question' ? (
						<p className={'answer-count'} aria-live="polite">
							{post.replyCount} {t(post.replyCount === 1 ? 'answer' : 'answers')}
							{post.acceptedReplyId ? ` · ${t('Has accepted answer')}` : ''}
						</p>
					) : null}

					<PostBody post={post} />

					{post.type === 'poll' ? (
						<PollPanel
							post={post}
							busy={busy}
							onVote={async (optionIds) => {
								if (!selfAuthor) {
									await sweetMixinErrorAlert(t('Sign in to vote.'));
									return;
								}
								setBusy(true);
								try {
									const result = await castPollVote({
										slug: post.slug,
										optionIds,
										userId: selfAuthor.id,
									});
									if (!result.ok) await sweetMixinErrorAlert(t(result.error));
									else await sweetTopSuccessAlert(t('Vote submitted.'));
								} finally {
									setBusy(false);
								}
							}}
						/>
					) : null}

					{post.type === 'resource' ? <ResourcePanel post={post} /> : null}
					{post.type === 'success' ? <SuccessPanel post={post} /> : null}

					{(post.related?.courseId || post.related?.instructorId) && post.type === 'question' ? (
						<div className={'inline-related'}>
							{post.related.courseTitle ? (
								<p>
									{t('Related course')}:{' '}
									<Link href={`/course/detail?id=${encodeURIComponent(post.related.courseId || '')}`}>
										{post.related.courseTitle}
									</Link>
								</p>
							) : null}
							{post.related.instructorName ? (
								<p>
									{t('Related instructor')}:{' '}
									<Link href={`/instructor/detail?id=${encodeURIComponent(post.related.instructorId || '')}`}>
										{post.related.instructorName}
									</Link>
								</p>
							) : null}
						</div>
					) : null}

					<ThreadedReplies
						postId={post.id}
						postSlug={post.slug}
						postAuthorId={post.author.id}
						postType={post.type}
						locked={post.locked}
						selfAuthor={selfAuthor}
						isModerator={isModerator}
						onReport={(replyId) => {
							setReportTarget(replyId);
							setReportOpen(true);
						}}
					/>
				</article>

				<RelatedContent post={post} relatedPosts={related} />
			</div>

			<ReportDialog
				open={reportOpen}
				onClose={() => setReportOpen(false)}
				onSubmit={async () => {
					await sweetTopSuccessAlert(
						t(
							reportTarget === 'post'
								? 'Report submitted. Moderators will review this post.'
								: 'Report submitted. Moderators will review this reply.',
						),
					);
				}}
			/>
		</div>
	);
};

export default withLayoutCourse(CommunityPostDetailPage, { title: 'Discussion — Academics' });
