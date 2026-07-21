import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack sx={{ p: 2 }}>
				<strong>About Academics</strong>
				<p>We help students master new languages with expert instructors and flexible learning paths.</p>
			</Stack>
		);
	}

	return (
		<Stack className={'about-page'}>
			<Stack className={'intro'}>
				<Stack className={'container'}>
					<Stack className={'left'}>
						<strong>We&apos;re on a Mission to Transform Language Learning.</strong>
					</Stack>
					<Stack className={'right'}>
						<p>
							Academics connects students with world-class instructors through online, offline, and hybrid courses.
							Whether you&apos;re preparing for IELTS, learning Korean from scratch, or advancing your business English —
							we provide the structure, support, and community you need to succeed.
							<br />
							<br />
							Our proven teaching methodology combines live interaction, recorded sessions, and personalized feedback
							so every student progresses at their own pace while staying motivated and engaged.
						</p>
						<Stack className={'boxes'}>
							<div className={'box'}>
								<div>
									<img src="/img/icons/garden.svg" alt="" />
								</div>
								<span>Expert Instructors</span>
								<p>Certified teachers with real classroom and online experience.</p>
							</div>
							<div className={'box'}>
								<div>
									<img src="/img/icons/securePayment.svg" alt="" />
								</div>
								<span>Flexible Learning</span>
								<p>Online, offline, and hybrid formats to fit your schedule.</p>
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'statistics'}>
				<Stack className={'container'}>
					<Stack className={'banner'}>
						<img src="/img/banner/header1.svg" alt="" />
					</Stack>
					<Stack className={'info'}>
						<Box component={'div'}>
							<strong>500+</strong>
							<p>Active Students</p>
						</Box>
						<Box component={'div'}>
							<strong>20+</strong>
							<p>Courses Available</p>
						</Box>
						<Box component={'div'}>
							<strong>98%</strong>
							<p>Student Satisfaction</p>
						</Box>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'agents'}>
				<Stack className={'container'}>
					<span className={'title'}>Our Expert Instructors</span>
					<p className={'desc'}>Passionate educators dedicated to your success</p>
				</Stack>
			</Stack>
			<Stack className={'options'}>
				<img src="/img/banner/aboutBanner.svg" alt="" className={'about-banner'} />
				<Stack className={'container'}>
					<strong>Why students choose Academics</strong>
					<Stack>
						<div className={'icon-box'}>
							<img src="/img/icons/security.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Live & Recorded Sessions</span>
							<p>Never miss a lesson — attend live or watch recordings at your convenience.</p>
						</div>
					</Stack>
					<Stack>
						<div className={'icon-box'}>
							<img src="/img/icons/keywording.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Personalized Feedback</span>
							<p>Get detailed feedback on assignments and speaking practice from your instructor.</p>
						</div>
					</Stack>
					<Stack>
						<div className={'icon-box'}>
							<img src="/img/icons/investment.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Recognized Certificates</span>
							<p>Earn a certificate upon course completion to showcase your achievement.</p>
						</div>
					</Stack>
					<Link href="/course">
						<Stack className={'btn'}>
							Browse Courses
							<img src="/img/icons/rightup.svg" alt="" />
						</Stack>
					</Link>
				</Stack>
			</Stack>
			<Stack className={'partners'}>
				<Stack className={'container'}>
					<span>Trusted by learners worldwide</span>
					<Stack className={'wrap'}>
						<img src="/img/icons/brands/amazon.svg" alt="" />
						<img src="/img/icons/brands/amd.svg" alt="" />
						<img src="/img/icons/brands/cisco.svg" alt="" />
						<img src="/img/icons/brands/dropcam.svg" alt="" />
						<img src="/img/icons/brands/spotify.svg" alt="" />
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'help'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'left'}>
						<strong>Need help? Talk to our team.</strong>
						<p>Get a free course recommendation or ask about enrollment options.</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<Link href="/cs">
							<div className={'white'}>
								Contact Us
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Link>
						<div className={'black'}>
							<img src="/img/icons/call.svg" alt="" />
							+82 10 4867 2909
						</div>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(About);
