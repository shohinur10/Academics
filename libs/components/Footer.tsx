import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';

const Footer = () => {
	const device = useDeviceDetect();

	const popularLinks = ['English', 'Korean', 'IELTS', 'Business English'];
	const discoverLinks = ['Online Courses', 'Offline Campus', 'Hybrid', 'Free Trial'];

	const renderLinks = (links: string[]) =>
		links.map((link) => (
			<Link href="/course" key={link}>
				<span>{link}</span>
			</Link>
		));

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="Academics" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Free consultation</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Live support</span>
							<p>+82 10 4867 2909</p>
							<span>Need help?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Courses</strong>
								{renderLinks(popularLinks)}
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<Link href="/cs"><span>Contact Support</span></Link>
								<Link href="/cs"><span>FAQs</span></Link>
							</div>
							<div>
								<strong>Discover</strong>
								{renderLinks(discoverLinks)}
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Academics — where learning meets opportunity. Academics {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="Academics" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Free consultation</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Live support</span>
							<p>+82 10 4867 2909</p>
							<span>Need help?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Stay updated with Academics</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Courses</strong>
								{renderLinks(popularLinks)}
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<Link href="/cs"><span>Contact Support</span></Link>
								<Link href="/cs"><span>FAQs</span></Link>
							</div>
							<div>
								<strong>Discover</strong>
								{renderLinks(discoverLinks)}
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Academics — where learning meets opportunity. Academics {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
