import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import StarIcon from '@mui/icons-material/Star';

interface InstructorCardProps {
	instructor: Member;
}

const resolveImage = (image?: string) => {
	if (!image) return '/img/profile/defaultUser.svg';
	if (image.startsWith('/') || image.startsWith('http')) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

const InstructorCard = (props: InstructorCardProps) => {
	const { instructor } = props;
	const router = useRouter();
	const instructorImage = resolveImage(instructor?.memberImage);

	const handleClick = () => {
		router.push({ pathname: '/instructor/detail', query: { id: instructor._id } });
	};

	return (
		<Stack className="top-agent-card instructor-card" onClick={handleClick} sx={{ cursor: 'pointer' }}>
			<img src={instructorImage} alt={instructor?.memberNick} />
			<strong>{instructor?.memberNick}</strong>
			<span>{instructor?.memberType}</span>
			<div className={'instructor-meta'}>
				<StarIcon sx={{ fontSize: 14, color: '#f5a623' }} />
				<Typography variant="caption">{instructor?.memberRank}% · {instructor?.memberProperties} courses</Typography>
			</div>
		</Stack>
	);
};

export default InstructorCard;
