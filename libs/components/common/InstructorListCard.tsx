import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface InstructorListCardProps {
	instructor: Member;
}

const InstructorListCard = (props: InstructorListCardProps) => {
	const { instructor } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const imagePath = instructor?.memberImage
		? `${REACT_APP_API_URL}/${instructor?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const pushDetailHandler = async (instructorId: string) => {
		await router.push({ pathname: '/instructor/detail', query: { id: instructorId } });
	};

	if (device === 'mobile') {
		return <div>INSTRUCTOR CARD</div>;
	}

	return (
		<Stack className="agent-general-card instructor-list-card" onClick={() => pushDetailHandler(instructor._id)}>
			<img src={imagePath} alt="" />
			<strong>{instructor?.memberFullName || instructor?.memberNick}</strong>
			<span>{instructor?.memberType}</span>
			<p>{instructor?.memberDesc || 'Experienced language instructor'}</p>
			<div className={'info'}>
				<span>
					<strong>{instructor?.memberProperties || 0}</strong> courses
				</span>
				<span>
					<strong>{instructor?.memberFollowers || 0}</strong> followers
				</span>
			</div>
		</Stack>
	);
};

export default InstructorListCard;
