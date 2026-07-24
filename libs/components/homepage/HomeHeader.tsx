import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Logout } from '@mui/icons-material';
import { userVar } from '../../../apollo/store';
import { logOut } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { sweetTopSuccessAlert } from '../../sweetAlert';
import LanguageSelector from './LanguageSelector';
import NavigationDrawer from './NavigationDrawer';
import { HOME_NAV_ITEMS } from './navigation';
import { openCreateContentModal } from '../community/create/createContentModalState';

const HomeHeader = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
	const isCommunityRoute = router.pathname.startsWith('/community');

	/** HANDLERS **/
	const closeMenu = () => setIsMenuOpen(false);
	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	const isActive = (pathname: string) =>
		pathname === '/' ? router.pathname === '/' : router.pathname.startsWith(pathname);

	const notificationsHandler = async () => {
		await sweetTopSuccessAlert(t('Notifications will be available soon.'));
	};

	const createHandler = () => {
		if (isCommunityRoute) {
			openCreateContentModal('discussion');
			return;
		}
		void router.push({ pathname: '/community', query: { create: 'discussion' } });
	};

	return (
		<header className={`home-header ${isCommunityRoute ? 'is-community-route' : ''}`}>
			<div className={'header-inner'}>
				<div className={'header-left'}>
					<IconButton
						className={'header-menu-btn'}
						aria-label={t('Open navigation menu')}
						aria-expanded={isMenuOpen}
						aria-controls="home-navigation-drawer"
						onClick={toggleMenu}
					>
						<MenuOutlinedIcon />
					</IconButton>
					<Link href={'/'} className={'home-logo-link'}>
						<div className={'home-logo'}>
							<img src="/img/logo/logoPurple.svg" alt="ACADEMICS logo" />
							<span>ACADEMICS</span>
						</div>
					</Link>

					<nav className={'header-nav'} aria-label={t('Primary')}>
						{HOME_NAV_ITEMS.map((item) => (
							<Link
								key={item.pathname}
								href={item.href}
								className={`header-nav-link ${isActive(item.pathname) ? 'active' : ''}`}
								aria-current={isActive(item.pathname) ? 'page' : undefined}
							>
								{t(item.label)}
							</Link>
						))}
					</nav>
				</div>

				<div className={'header-right'}>
					<IconButton className={'header-search-btn'} aria-label={t('Course Search')} href={'/course'}>
						<SearchOutlinedIcon />
					</IconButton>

					<button
						type="button"
						className={'header-create-btn'}
						aria-label={t('Create')}
						onClick={createHandler}
					>
						<AddRoundedIcon />
						<span className={'header-create-label'}>{t('Create')}</span>
					</button>

					<IconButton
						className={'header-notify-btn'}
						aria-label={t('Notifications')}
						onClick={notificationsHandler}
					>
						<NotificationsNoneOutlinedIcon />
					</IconButton>

					{user?._id ? (
						<>
							<button
								type="button"
								className={'header-user'}
								aria-label={t('My Learning')}
								onClick={(e) => setLogoutAnchor(e.currentTarget)}
							>
								<img
									src={
										user?.memberImage
											? `${REACT_APP_API_URL}/${user?.memberImage}`
											: '/img/profile/defaultUser.svg'
									}
									alt={user?.memberNick ?? 'profile'}
								/>
							</button>
							<Menu
								anchorEl={logoutAnchor}
								open={Boolean(logoutAnchor)}
								onClose={() => setLogoutAnchor(null)}
								sx={{ mt: '5px' }}
							>
								<MenuItem onClick={() => logOut()}>
									<Logout fontSize="small" style={{ color: '#5b35f5', marginRight: '10px' }} />
									Logout
								</MenuItem>
							</Menu>
						</>
					) : (
						<Link href={'/account/join'}>
							<div className={'header-join-btn'}>
								<AccountCircleOutlinedIcon />
								<span>
									{t('Login')} / {t('Register')}
								</span>
							</div>
						</Link>
					)}

					<div className={'header-lang'}>
						<LanguageSelector />
					</div>
				</div>
			</div>

			<NavigationDrawer open={isMenuOpen} onClose={closeMenu} />
		</header>
	);
};

export default HomeHeader;
