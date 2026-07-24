import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { HELP_POPULAR_SEARCHES } from '../../../types/support/helpCenter';
import SearchInput from '../../support/common/SearchInput';

interface HelpHeroProps {
	onSearch: (query: string) => void;
	initialQuery?: string;
}

const HelpHero = ({ onSearch, initialQuery = '' }: HelpHeroProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const goSearch = (next: string) => {
		onSearch(next);
		if (next) {
			void router.push({ pathname: '/support/faq', query: { q: next } }, undefined, { shallow: false });
		}
	};

	return (
		<section className={'help-hero'} aria-labelledby="help-hero-title">
			<div className={'help-hero-copy'}>
				<p className={'help-eyebrow'}>{t('Help Center')}</p>
				<h1 id="help-hero-title">{t('How can we help you today?')}</h1>
				<p className={'help-subtitle'}>
					{t('Search articles, find answers, contact support, or track your requests.')}
				</p>

				<SearchInput
					id="help-search-input"
					className="help-search support-search"
					label={t('Search help articles')}
					placeholder={t('Search articles, payments, certificates, login...')}
					value={initialQuery}
					submitLabel={t('Search')}
					onSubmit={goSearch}
				/>

				<div className={'popular-searches'}>
					<span>{t('Popular searches')}</span>
					<ul>
						{HELP_POPULAR_SEARCHES.map((term) => (
							<li key={term}>
								<button type="button" onClick={() => goSearch(term)}>
									{t(term)}
								</button>
							</li>
						))}
					</ul>
				</div>

				<p className={'help-track-link'}>
					<Link href="/support/requests">{t('Track my support requests')}</Link>
				</p>
			</div>

			<div className={'help-hero-visual'}>
				<Image
					src="/img/cs/help-center-hero.png"
					alt={t('Support agent helping with laptop, chat bubbles, and FAQ cards')}
					width={640}
					height={480}
					priority
					sizes="(max-width: 900px) 100vw, 520px"
				/>
			</div>
		</section>
	);
};

export default HelpHero;
