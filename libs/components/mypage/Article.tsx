import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Article = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ARTICLE CARD</div>;
	}

	return (
		<Stack className="card-config">
			<Stack className="top">
				<img src="/img/banner/header1.svg" alt="" />
				<Box component={'div'} className={'date'}>
					<Typography>Study Tips</Typography>
				</Box>
			</Stack>
			<Stack className="bottom">
				<Stack className="name-address">
					<Stack className="name">
						<Typography>How to practice speaking every day</Typography>
					</Stack>
					<Stack className="address">
						<Typography>Language learning tips from Academics</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Article;
