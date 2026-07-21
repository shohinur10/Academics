import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Logout } from '@mui/icons-material';
import { userVar } from '../../../apollo/store';
import { logOut } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import LanguageSelector from './LanguageSelector';
import NavigationDrawer from './NavigationDrawer';

const HomeHeader = () => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);

	/** HANDLERS **/
	const closeMenu = () => setIsMenuOpen(false);
	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	return (
		<header className={'home-header'}>
			<div className={'header-inner'}>
				<div className={'header-left'}>
					<IconButton
						className={'header-menu-btn'}
						aria-label="Open navigation menu"
						aria-expanded={isMenuOpen}
						aria-controls="home-navigation-drawer"
						onClick={toggleMenu}
					>
						<MenuOutlinedIcon />
					</IconButton>
					<Link href={'/'}>
						<div className={'home-logo'}>
							<img src="/img/logo/logoPurple.svg" alt="NESTAR logo" />
							<span>NESTAR</span>
						</div>
					</Link>
				</div>

				<div className={'header-right'}>
					<Link href={'/course'}>
						<IconButton className={'header-search-btn'} aria-label={t('Course Search')}>
							<SearchOutlinedIcon />
						</IconButton>
					</Link>

					{user?._id ? (
						<>
							<button
								type="button"
								className={'header-user'}
								aria-label={t('My Learning')}
								onClick={(e) => setLogoutAnchor(e.currentTarget)}
							>
								<img
									src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
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
