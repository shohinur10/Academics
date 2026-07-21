import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Pagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InstructorCard from '../../libs/components/homepage/InstructorCard';
import { MOCK_INSTRUCTORS } from '../../libs/mock/instructors.mock';
import { Member } from '../../libs/types/member/member';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const InstructorList: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [instructors, setInstructors] = useState<Member[]>(MOCK_INSTRUCTORS);
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 8;

	useEffect(() => {
		const page = Number(router.query.page) || 1;
		setCurrentPage(page);
		const start = (page - 1) * limit;
		setInstructors(MOCK_INSTRUCTORS.slice(start, start + limit));
	}, [router.query.page]);

	const handlePaginationChange = async (_: ChangeEvent<unknown>, value: number) => {
		await router.push(`/instructor?page=${value}`, `/instructor?page=${value}`, { scroll: false });
	};

	if (device === 'mobile') {
		return (
			<Stack sx={{ p: 2 }}>
				<Typography variant="h5">Instructors</Typography>
				{instructors.map((instructor) => (
					<InstructorCard key={instructor._id} instructor={instructor} />
				))}
			</Stack>
		);
	}

	return (
		<div id="agent-page" className="instructor-page">
			<div className="container">
				<Stack className={'agent-page'}>
					<Stack className={'card-wrapper'} direction="row" flexWrap="wrap" spacing={3} sx={{ py: 4 }}>
						{instructors.map((instructor) => (
							<InstructorCard key={instructor._id} instructor={instructor} />
						))}
					</Stack>
					<Stack alignItems="center" sx={{ pb: 4 }}>
						<Pagination
							count={Math.ceil(MOCK_INSTRUCTORS.length / limit)}
							page={currentPage}
							onChange={handlePaginationChange}
							shape="circular"
							color="primary"
						/>
						<Typography sx={{ mt: 2 }}>
							Total {MOCK_INSTRUCTORS.length} instructors
						</Typography>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(InstructorList);
