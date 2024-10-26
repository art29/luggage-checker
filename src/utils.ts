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