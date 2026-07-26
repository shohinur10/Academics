import React from 'react';
import Image from 'next/image';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const STATS = [
	{ value: '18,000+', label: 'Students' },
	{ value: '500+', label: 'Courses' },
	{ value: '60+', label: 'Expert Instructors' },
	{ value: '98%', label: 'Satisfaction' },
] as const;

const BENEFITS = [
	'Learn at your own pace',
	'Certified instructors',
	'Recognized certificates',
	'Global learning community',
	'Interactive live classes',
] as const;

const TRUST_AVATARS = [
	'/img/profile/girl.svg',
	'/img/profile/defaultUser.svg',
	'/img/profile/agent.png',
	'/img/profile/girl.svg',
	'/img/profile/defaultUser.svg',
] as const;

interface AuthMarketingPanelProps {
	quote?: string;
	studentName?: string;
	studentMeta?: string;
	trustLine?: string;
	showBenefits?: boolean;
}

const AuthMarketingPanel = ({
	quote = 'The best platform for learning new languages.',
	studentName = 'Sarah Kim',
	studentMeta = 'Student · South Korea',
	trustLine = 'Trusted by learners from around the world',
	showBenefits = true,
}: AuthMarketingPanelProps) => (
	<div className="auth-marketing">
		<div className="auth-marketing-visual">
			<div className="auth-float auth-float-a" aria-hidden="true" />
			<div className="auth-float auth-float-b" aria-hidden="true" />
			<div className="auth-float auth-float-c" aria-hidden="true" />
			<Image
				src="/img/account/register-illustration.jpg"
				alt="Laptop, books, graduation cap, and learning tools illustrating global education"
				width={720}
				height={720}
				className="auth-marketing-illustration"
				loading="lazy"
				quality={72}
				sizes="(max-width: 960px) 100vw, 48vw"
			/>
		</div>

		<ul className="auth-stats" aria-label="Platform statistics">
			{STATS.map((stat) => (
				<li key={stat.label}>
					<strong>{stat.value}</strong>
					<span>{stat.label}</span>
				</li>
			))}
		</ul>

		{showBenefits ? (
			<ul className="auth-benefits">
				{BENEFITS.map((benefit) => (
					<li key={benefit}>
						<span className="auth-benefit-check" aria-hidden="true">
							<CheckRoundedIcon fontSize="inherit" />
						</span>
						{benefit}
					</li>
				))}
			</ul>
		) : null}

		<figure className="auth-testimonial">
			<div className="auth-stars" aria-label="5 out of 5 stars">
				★★★★★
			</div>
			<blockquote>
				<p>&ldquo;{quote}&rdquo;</p>
			</blockquote>
			<figcaption className="auth-testimonial-author">
				<Image src="/img/profile/girl.svg" alt="" width={40} height={40} />
				<div>
					<strong>{studentName}</strong>
					<span>{studentMeta}</span>
				</div>
			</figcaption>
		</figure>

		<div className="auth-trust">
			<div className="auth-trust-avatars" aria-hidden="true">
				{TRUST_AVATARS.map((src, index) => (
					<Image key={`${src}-${index}`} src={src} alt="" width={28} height={28} />
				))}
			</div>
			<p>{trustLine}</p>
		</div>
	</div>
);

export default AuthMarketingPanel;
