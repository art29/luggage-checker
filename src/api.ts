import regulations from "./regulations.json";

export type LuggageTypes = 'CARRY_ON' | 'CHECKED' | 'PERSONAL_ITEM';

interface BaseLuggageType {
	type: LuggageTypes;
	maxWeight?: number;
}

interface LuggageTypeSize extends BaseLuggageType {
	maxTotalSize: number;
}

interface LuggageTypeDimensions extends BaseLuggageType {
	maxHeight: number;
	maxWidth: number;
	maxDepth: number;
}

type LuggageType = LuggageTypeSize | LuggageTypeDimensions;

interface BaseCarrier {
	country: string;
	carrierName: string;
	carrierCodes: string[];
	luggageTypes: LuggageType[];
}

export interface Carrier extends BaseCarrier {
	luggageTypes: LuggageType[];
}

export interface CarrierWithAllowedLuggage extends BaseCarrier {
	luggageTypes: (LuggageType & {isAllowed: boolean})[];
}

const getDataFromJson = (): Carrier[] => {
	return regulations as Carrier[];
}

export const checkLuggageBySize = (dimensions: [number, number, number]): CarrierWithAllowedLuggage[] => {

	// Get data from the JSON
	const data = getDataFromJson();

	// Check if the luggage is allowed for each carrier and luggage type
	return data.map(carrier => {
		const updatedLuggageTypes = carrier.luggageTypes = carrier.luggageTypes.map(luggage => {
			let isAllowed: boolean;

			// Check if the luggage is allowed based on the maxTotalSize or the max dimensions
			if ('maxTotalSize' in luggage) {
				isAllowed = dimensions.reduce((sum, dimension) => sum + dimension, 0) <= luggage.maxTotalSize;
			} else {
				const sortedDimensions = dimensions.sort((a, b) => a - b);
				const sortedLuggageDimensions = [luggage.maxHeight, luggage.maxWidth, luggage.maxDepth].sort((a, b) => a - b);
				isAllowed = sortedDimensions[0] <= sortedLuggageDimensions[0] && sortedDimensions[1] <= sortedLuggageDimensions[1] && sortedDimensions[2] <= sortedLuggageDimensions[2];
			}

			return {...luggage, isAllowed};
		});
		return { ...carrier, luggageTypes: updatedLuggageTypes };
	});
}