import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

export interface HomeNavItem {
	label: string;
	href: string;
	pathname: string;
	icon: React.ReactNode;
}

/** Single source of truth for homepage navigation links (drawer, any future nav). */
export const HOME_NAV_ITEMS: HomeNavItem[] = [
	{ label: 'Home', href: '/', pathname: '/', icon: <HomeOutlinedIcon /> },
	{ label: 'Courses', href: '/course', pathname: '/course', icon: <MenuBookOutlinedIcon /> },
	{ label: 'Instructors', href: '/instructor', pathname: '/instructor', icon: <SchoolOutlinedIcon /> },
	{
		label: 'Community',
		href: '/community?articleCategory=FREE',
		pathname: '/community',
		icon: <GroupsOutlinedIcon />,
	},
	{ label: 'Support', href: '/cs', pathname: '/cs', icon: <SupportAgentOutlinedIcon /> },
];
