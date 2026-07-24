import React from 'react';
import { useTranslation } from 'next-i18next';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { Member } from '../../../types/member/member';

interface InstructorCertificationsProps {
	instructor: Member;
}

const InstructorCertifications = ({ instructor }: InstructorCertificationsProps) => {
	const { t } = useTranslation('common');
	const certs = instructor.memberCertifications ?? [];

	if (!certs.length) return null;

	return (
		<ul className={'instructor-certs'}>
			{certs.map((cert) => (
				<li key={`${cert.name}-${cert.year}`}>
					<span className={'cert-icon'}>
						<WorkspacePremiumOutlinedIcon />
					</span>
					<div className={'cert-body'}>
						<strong>{cert.name}</strong>
						<span>
							{cert.organization} · {cert.year}
						</span>
					</div>
					{cert.credentialUrl && (
						<a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" aria-label={t('View credential')}>
							<OpenInNewRoundedIcon />
						</a>
					)}
				</li>
			))}
		</ul>
	);
};

export default InstructorCertifications;
