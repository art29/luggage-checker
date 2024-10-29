import * as m from '$lib/paraglide/messages.js';

export const getCountryFromCode = (code: string) => {
	switch (code) {
		case 'CA':
			return m.canada();
		case 'FR':
			return m.france();
		case 'UK':
			return m.unitedKingdom();
		case 'NL':
			return m.netherlands();
		default:
			return 'Unknown';
	}
}

export const getMeasurementsFromUnit = (cm: number, unit: 'CM' | 'IN') => {
	if (unit === 'IN') {
		return (cm / 2.54).toFixed(1);
	}
	return cm;
}