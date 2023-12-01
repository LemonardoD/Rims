import "dotenv/config";
import { RimParamDTO } from "../types/dbDto";

export const { PHOTO_PATH, PRICE_INDEX, VENDOR_RATE } = <{ PHOTO_PATH: string; PRICE_INDEX: string; VENDOR_RATE: string }>(
	process.env
);

export const priceToUAH = (usd: number) => {
	return Math.floor(usd * Number(VENDOR_RATE) * Number(PRICE_INDEX));
};

export const photoArrPath = (imgs: string[]) => {
	return imgs.map(el => `${PHOTO_PATH + el}`);
};

export const photoPath = (img: string) => {
	return `${PHOTO_PATH + img}`;
};

export const nameConn = (str1: string, str2: string | null) => {
	return str1 && str2 ? `${str1} ${str2}` : `${str1}`;
};

export const idConvert = (number: bigint | number) => {
	return number.toString();
};

export const rimsSort = (rim1: RimParamDTO, rim2: RimParamDTO) => {
	return +rim1.width - +rim2.width || +rim1.diameter - +rim2.diameter;
};
