import "dotenv/config";
import ExchangeRate from "../database/repositories/exchangeRepo";
import { RimParamDTO } from "../DTOs/dbDTos";

export const { PHOTO_PATH } = <{ PHOTO_PATH: string }>process.env;
const rate = await ExchangeRate.usdExchRate();

export function priceToUAH(usd: number) {
	return Math.floor(usd * rate);
}

export function photoArrPath(imgs: string[]) {
	return imgs.map(el => `${PHOTO_PATH + el}`);
}

export function photoPath(img: string) {
	return `${PHOTO_PATH + img}`;
}

export function nameConn(str1: string, str2: string | null) {
	return str1 && str2 ? `${str1} ${str2}` : `${str1}`;
}

export function idConvert(number: bigint | number) {
	return number.toString();
}

export function rimsSort(rim1: RimParamDTO, rim2: RimParamDTO) {
	return +rim1.width - +rim2.width || +rim1.diameter - +rim2.diameter;
}
