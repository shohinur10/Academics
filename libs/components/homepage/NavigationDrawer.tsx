import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Drawer, IconButton } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { userVar } from '../../../apollo/store';
import { HOME_NAV_ITEMS } from './navigation';
import LanguageSelector from './LanguageSelector';

interface NavigationDrawerProps {
	open: boolean;
	onClose: () => void;
}

const NavigationDrawer = ({ open, onClose }: NavigationDrawerProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** Close whenever the route changes (Pages Router events). **/
	useEffect(() => {
		const handleRouteChange = () => onClose();
		router.events.on('routeChangeStart', handleRouteChange);
		return () => router.events.off('routeChangeStart', handleRouteChange);
	}, [router.events, onClose]);

	const isActive = (pathname: string) =>
		pathname === '/' ? router.pathname === '/' : router.pathname.startsWith(pathname);

	return (
		<Drawer
			anchor="left"
			open={open}
			onClose={onClose}
			className={'navigation-drawer'}
			transitionDuration={{ enter: 280, exit: 240 }}
			SlideProps={{ easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
			ModalProps={{ keepMounted: true }}
			PaperProps={{ id: 'home-navigation-drawer' }}
		>
			<div className={'drawer-inner'}>
				<div className={'drawer-head'}>
					<Link href={'/'}>
						<div className={'home-logo'}>
							<img src="/img/logo/logoPurple.svg" alt="NESTAR logo" />
							<span>NESTAR</span>
						</div>
					</Link>
					<IconButton className={'drawer-close-btn'} aria-label="Close navigation menu" onClick={onClose}>
						<CloseOutlinedIcon />
					</IconButton>
				</div>

				<nav className={'drawer-nav'} aria-label="Main navigation">
					{HOME_NAV_ITEMS.map((item) => (
						<Link key={item.pathname} href={item.href}>
							<div className={`drawer-nav-item ${isActive(item.pathname) ? 'active' : ''}`} onClick={onClose}>
								{item.icon}
								<span>{t(item.label)}</span>
							</div>
						</Link>
					))}
					{user?._id && (
						<Link href={'/mypage'}>
							<div className={`drawer-nav-item ${isActive('/mypage') ? 'active' : ''}`} onClick={onClose}>
								<VideocamOutlinedIcon />
								<span>{t('My Learning')}</span>
							</div>
						</Link>
					)}
				</nav>

				<div className={'drawer-bottom'}>
					<hr className={'drawer-divider'} />
					{!user?._id && (
						<Link href={'/account/join'}>
							<div className={'drawer-nav-item'} onClick={onClose}>
								<AccountCircleOutlinedIcon />
								<span>
									{t('Login')} / {t('Register')}
								</span>
							</div>
						</Link>
					)}
					<div className={'drawer-lang'}>
						<LanguageSelector showLabel />
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default NavigationDrawer;
