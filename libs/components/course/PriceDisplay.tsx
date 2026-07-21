import React from 'react';
import { useTranslation } from 'next-i18next';

interface PriceDisplayProps {
	price: number;
	originalPrice?: number;
	/** Also render the "% off" badge next to the strikethrough price. */
	showDiscount?: boolean;
}

/** Price with optional strikethrough original price, shared by cards, purchase card and the mobile bar. */
const PriceDisplay = ({ price, originalPrice, showDiscount = false }: PriceDisplayProps) => {
	const { t } = useTranslation('common');
	const hasDiscount = originalPrice !== undefined && originalPrice > price;
	const discount = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;

	return (
		<span className={'price-display'}>
			<strong>${price}</strong>
			{hasDiscount && <s>${originalPrice}</s>}
			{showDiscount && discount > 0 && (
				<span className={'discount-badge'}>
					{discount}% {t('off')}
				</span>
			)}
		</span>
	);
};

export default PriceDisplay;
