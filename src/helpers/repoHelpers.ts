import * as dotenv from "dotenv";
import { RimById, RimByIdFromDB, RimsFromDB, RimsMainSortedBrand } from "../DTOs/dbDTos";
dotenv.config();

export const { EXCHANGE_RATE, PHOTO_PATH } = <{ EXCHANGE_RATE: string; PHOTO_PATH: string }>process.env;

export function priceToUAH(usd: number | null) {
	if (usd) {
		return Math.floor(usd * Number(EXCHANGE_RATE));
	}
	return null;
}

export function photoArrPath(imgs: string[] | null) {
	if (imgs) {
		return imgs.map(el => `${PHOTO_PATH + el.replaceAll(" ", "_").replaceAll("%2", "")}`);
	}
	return null;
}

export function photoPath(img: string | null) {
	if (img) {
		return `${PHOTO_PATH + img.replaceAll(" ", "_").replaceAll("%2", "")}`;
	}
	return null;
}

export function nameConnector(nm1: string | null, nm2: string | null) {
	if (nm1 && nm2) {
		return `${nm1} - ${nm2}`;
	}
	if (!nm2) {
		return nm1;
	}
	return null;
}

export function stringConverter(number: number | bigint | null) {
	if (number) {
		return number.toString();
	}
	return null;
}
export function dbSorter(array: RimsFromDB[]): RimsMainSortedBrand[] {
	let result = [];
	for (let i = 0; i < array.length; i++) {
		result.push({
			rimId: stringConverter(array[i].rimId),
			name: nameConnector(array[i].rimBrand, array[i].rimName),
			image: photoPath(array[i].image),
			diameter: array[i].diameter,
			price: priceToUAH(array[i].price),
		});
	}
	return result.filter(rim => rim.rimId !== null);
}

export function dbSorterRimById(array: RimByIdFromDB[]): RimById {
	const [{ mountingHoles, priceUSD, rimBrand, rimName, images }] = array;
	let width: string[] = [];
	let diameter: string[] = [];
	array.map(el => {
		if (el.rimWidth && !width.includes(el.rimWidth)) {
			width.push(el.rimWidth);
		}
		if (el.rimDiameter && !diameter.includes(el.rimDiameter)) {
			diameter.push(el.rimDiameter);
		}
	});
	return {
		name: nameConnector(rimBrand, rimName),
		width,
		diameter,
		mountingHoles: mountingHoles,
		price: priceToUAH(priceUSD),
		images: photoArrPath(images),
	};
}
