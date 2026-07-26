/** Allow only same-origin relative paths — blocks open redirects via ?referrer=. */
export const safeInternalPath = (value: unknown, fallback = '/'): string => {
	if (typeof value !== 'string' || !value) return fallback;
	const trimmed = value.trim();
	if (!trimmed.startsWith('/')) return fallback;
	if (trimmed.startsWith('//') || trimmed.includes('\\') || trimmed.includes('://')) return fallback;
	return trimmed;
};
