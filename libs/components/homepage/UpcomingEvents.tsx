import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { MOCK_EVENTS } from '../../mock/events.mock';

const EventCard = ({ event }: { event: (typeof MOCK_EVENTS)[0] }) => {
	return (
		<Stack
			className="event-card"
			style={{
				backgroundImage: `url(${event.imageSrc})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Box component={'div'} className={'info'}>
				<strong>{event.eventType}</strong>
				<span>{event.eventTitle}</span>
			</Box>
			<Box component={'div'} className={'more'}>
				<span>{event.description}</span>
			</Box>
		</Stack>
	);
};

const UpcomingEvents = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'events upcoming-events'} sx={{ px: 2 }}>
				<span>Upcoming Events</span>
			</Stack>
		);
	}

	return (
		<Stack className={'events upcoming-events'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span className={'white'}>Upcoming Events</span>
						<p className={'white'}>Webinars, open classes, and demo days await you!</p>
					</Box>
				</Stack>
				<Stack className={'card-wrapper'}>
					{MOCK_EVENTS.map((event) => (
						<EventCard event={event} key={event.eventTitle} />
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default UpcomingEvents;
