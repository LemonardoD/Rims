import * as dotenv from "dotenv";
dotenv.config();
import {
	RimByIdDTO,
	RimByIdConfigFromDBDTO,
	RimByIdOfferFromDBDTO,
	RimVariationsDTO,
	RimsFromDBDTO,
	RimsMainSortedBrandDTO,
} from "../DTOs/dbDTos";

export const { EXCHANGE_RATE, PHOTO_PATH } = <{ EXCHANGE_RATE: string; PHOTO_PATH: string }>process.env;

export function priceToUAH(usd: number | null) {
	if (usd) {
		return Math.floor(usd * Number(EXCHANGE_RATE));
	}
	return 0;
}

export function photoArrPath(imgs: string[] | null) {
	if (imgs) {
		return imgs.map(el => `${PHOTO_PATH + el.replaceAll(" ", "_").replaceAll("%2", "")}`);
	}
	return [];
}

export function photoPath(img: string | null) {
	if (img) {
		return `${PHOTO_PATH + img.replaceAll(" ", "_").replaceAll("%2", "")}`;
	}
	return null;
}

export function nameConnector(nm1: string | null, nm2: string | null, nm3?: string | null) {
	if (nm1 && nm2 && nm3) {
		return `${nm1} - ${nm2} ${nm3}`;
	}
	if (!nm3) {
		return `${nm1} - ${nm2}`;
	}
	if (!nm2) {
		return nm1;
	}
	return null;
}

export function idConvert(number: number | bigint | null) {
	if (number) {
		return number.toString();
	}
	return null;
}

export function resultMerger(array: RimsFromDBDTO[]) {
	const sortedArr = dbRimRespSorter(array);
	const mergedRes = sortedArr.reduce((previous: RimsMainSortedBrandDTO[], next: RimsMainSortedBrandDTO) => {
		const match = previous.find(el => el.rimId === next.rimId);
		if (!match) {
			previous.push(next);
		}
		if (match) {
			match.diameter[match.diameter.length] = next.diameter[0];
			match.price[match.price.length] = next.price[0];
		}
		return previous;
	}, []);
	return mergedRes;
}

export function dbRimRespSorter(array: RimsFromDBDTO[]): RimsMainSortedBrandDTO[] {
	let result: RimsMainSortedBrandDTO[] = [];
	for (let i = 0; i < array.length; i++) {
		if (array[i].rimSuffixName) {
			result.push({
				rimId: idConvert(array[i].rimId),
				name: nameConnector(array[i].rimBrand, array[i].rimName, array[i].rimSuffixName),
				image: photoPath(array[i].image),
				diameter: [array[i].diameter],
				price: [priceToUAH(array[i].price)],
			});
		}
		result.push({
			rimId: idConvert(array[i].rimId),
			name: nameConnector(array[i].rimBrand, array[i].rimName, array[i].rimAttrs?.name_suffix),
			image: photoPath(array[i].image),
			diameter: [array[i].diameter],
			price: [priceToUAH(array[i].price)],
		});
	}
	return result.filter(rim => rim.rimId !== null && rim.price[0] !== null);
}

export function dbSortConfigRimById(array: RimByIdConfigFromDBDTO[]): RimByIdDTO {
	const [{ rimBrand, rimName, images }] = array;
	let rimVariations: RimVariationsDTO[] = [];
	array.map(el => {
		if (el.rimWidth && el.rimDiameter && el.mountingHoles) {
			rimVariations.push({
				width: el.rimWidth,
				diameter: el.rimDiameter,
				mountingHoles: el.mountingHoles,
				price: priceToUAH(el.priceUSD),
			});
		}
	});
	return {
		name: nameConnector(rimBrand, rimName),
		images: photoArrPath(images),
		rimVariations,
	};
}

export function dbSortOfferRimById(array: RimByIdOfferFromDBDTO[]): RimByIdDTO {
	const [{ rimBrand, rimName, images }] = array;
	let rimVariations: RimVariationsDTO[] = [];
	array.map(el => {
		if (el.rimAtr) {
			rimVariations.push({
				width: el.rimAtr.width,
				diameter: el.rimAtr.diameter,
				mountingHoles: el.rimAtr.boltPattern,
				price: priceToUAH(el.rimAtr.priceInUsd),
			});
		}
	});
	return {
		name: nameConnector(rimBrand, rimName),
		images: photoArrPath(images),
		rimVariations,
	};
}
