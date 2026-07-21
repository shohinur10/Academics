import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import StarIcon from '@mui/icons-material/Star';

interface InstructorCardProps {
	instructor: Member;
}

const InstructorCard = (props: InstructorCardProps) => {
	const { instructor } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const instructorImage = instructor?.memberImage
		? `${REACT_APP_API_URL}/${instructor?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const handleClick = () => {
		router.push({ pathname: '/instructor/detail', query: { id: instructor._id } });
	};

	return (
		<Stack className="top-agent-card instructor-card" onClick={handleClick} sx={{ cursor: 'pointer' }}>
			<img src={instructorImage} alt={instructor?.memberNick} />
			<strong>{instructor?.memberNick}</strong>
			<span>{instructor?.memberType}</span>
			<Box className={'instructor-meta'}>
				<StarIcon sx={{ fontSize: 14, color: '#f5a623' }} />
				<Typography variant="caption">{instructor?.memberRank}% · {instructor?.memberProperties} courses</Typography>
			</Box>
		</Stack>
	);
};

export default InstructorCard;
