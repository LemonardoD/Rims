import * as dotenv from "dotenv";
dotenv.config();
import { getUsdExchange } from "../database/repositories/exchangeRepo";

export const { PHOTO_PATH } = <{ PHOTO_PATH: string }>process.env;
const rate = await getUsdExchange();

export function priceToUAH(usd: number) {
	return Math.floor(usd * rate);
}

export function photoArrPath(imgs: string[] | null | undefined) {
	if (imgs) {
		return imgs.map(el => `${PHOTO_PATH + el}`);
	}
	return [];
}

export function photoPath(img: string | null | undefined) {
	return `${PHOTO_PATH + img}`;
}

export function nameConn(str1: string | null, str2: string | null) {
	if (str1 && str2) {
		return `${str1} ${str2}`;
	}
	return `${str1}`;
}

export function idConvert(number: number | bigint | null) {
	return `${number}`;
}
