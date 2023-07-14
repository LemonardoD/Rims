import * as dotenv from "dotenv";
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
		return imgs.map(el => `${PHOTO_PATH + el}`);
	}
	return null;
}

export function photoPath(img: string | null) {
	if (img) {
		return `${PHOTO_PATH + img}`;
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
