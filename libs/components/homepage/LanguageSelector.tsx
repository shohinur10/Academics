import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import { CaretDown } from 'phosphor-react';

interface LanguageOption {
	id: string;
	label: string;
	flag: string;
}

const LANGUAGES: LanguageOption[] = [
	{ id: 'en', label: 'English', flag: '/img/flag/langen.png' },
	{ id: 'kr', label: 'Korean', flag: '/img/flag/langkr.png' },
	{ id: 'ru', label: 'Russian', flag: '/img/flag/langru.png' },
];

interface LanguageSelectorProps {
	showLabel?: boolean;
}

const LanguageSelector = ({ showLabel = false }: LanguageSelectorProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [lang, setLang] = useState<string>('en');
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale') as string);
		}
	}, [router]);

	/** HANDLERS **/
	const langChoice = useCallback(
		async (id: string) => {
			setLang(id);
			localStorage.setItem('locale', id);
			setAnchorEl(null);
			await router.push(router.asPath, router.asPath, { locale: id });
		},
		[router],
	);

	const current = LANGUAGES.find((option) => option.id === lang) ?? LANGUAGES[0];

	return (
		<>
			<Button
				disableRipple
				className={'language-selector-btn'}
				aria-label={t('English')}
				onClick={(e) => setAnchorEl(e.currentTarget)}
				endIcon={<CaretDown size={13} color="#60657a" weight="fill" />}
			>
				<img className={'language-flag'} src={current.flag} alt={t(current.label)} />
				{showLabel && <span className={'language-label'}>{t(current.label)}</span>}
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				{LANGUAGES.map((option) => (
					<MenuItem key={option.id} disableRipple onClick={() => langChoice(option.id)}>
						<img className="img-flag" src={option.flag} alt={t(option.label)} />
						{t(option.label)}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default LanguageSelector;
