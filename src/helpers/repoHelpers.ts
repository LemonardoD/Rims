import * as dotenv from "dotenv";
dotenv.config();
import { RimInfoFromDBDTO, SortedRimInfoDTO, ConfigSorterDTO } from "../DTOs/dbDTos";
import { ConfigDTO } from "../DTOs/otherDTOs";
import { getUsdExchange } from "../database/repositories/exchangeRepo";

export const { PHOTO_PATH } = <{ PHOTO_PATH: string }>process.env;

export async function priceToUAH(usd: number) {
	const rate = await getUsdExchange();
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
	if (str1 && !str2) {
		return `${str1}`;
	}
	return str1 as string;
}

export function idConvert(number: number | bigint | null) {
	return number?.toString() as string;
}

export async function respSorter(array: RimInfoFromDBDTO[]): Promise<SortedRimInfoDTO[]> {
	let result: SortedRimInfoDTO[] = [];
	for (let i = 0; i < array.length; i++) {
		let newConfig = array[i].rimConfigs;
		if (newConfig) {
			newConfig.price = await priceToUAH(array[i].price as number);
			if (array[i].images) {
				result.push({
					rimId: idConvert(array[i].rimId),
					brand: array[i].brand,
					name: nameConn(array[i].name, array[i].nameSuff),
					images: photoArrPath(array[i].images),
					config: [newConfig],
				});
			}
			if (array[i].image) {
				result.push({
					rimId: idConvert(array[i].rimId),
					brand: array[i].brand,
					name: nameConn(array[i].name, array[i].nameSuff),
					image: photoPath(array[i].image),
					config: [newConfig],
				});
			}
		}
	}
	return result;
}

export function resultMergerConfig(array: RimInfoFromDBDTO[], config: ConfigDTO) {
	const { width, diameter, mountingHoles } = config;
	if (width && diameter && !mountingHoles) {
		const finalArray: RimInfoFromDBDTO[] = [];
		array.map(el => {
			if (el.rimConfigs?.diameter === diameter && el.rimConfigs?.width === width) {
				finalArray.push(el);
			}
		});
		return resultMerger(finalArray.filter(rim => rim));
	}
	if (!width && diameter && mountingHoles) {
		const finalArray: RimInfoFromDBDTO[] = [];
		array.map(el => {
			if (el.rimConfigs?.diameter === diameter && el.rimConfigs?.boltPattern === mountingHoles) {
				finalArray.push(el);
			}
		});
		return resultMerger(finalArray.filter(rim => rim));
	}
	if (width && !diameter && mountingHoles) {
		const finalArray: RimInfoFromDBDTO[] = [];
		array.map(el => {
			if (el.rimConfigs?.width === width && el.rimConfigs?.boltPattern === mountingHoles) {
				finalArray.push(el);
			}
		});
		return resultMerger(finalArray.filter(rim => rim));
	}
	if (width && !diameter && !mountingHoles) {
		const finalArray: RimInfoFromDBDTO[] = [];
		array.map(el => {
			if (el.rimConfigs?.width === width) {
				finalArray.push(el);
			}
		});
		return resultMerger(finalArray.filter(rim => rim));
	}
	if (!width && diameter && !mountingHoles) {
		const finalArray: RimInfoFromDBDTO[] = [];
		array.map(el => {
			if (el.rimConfigs?.diameter === diameter) {
				finalArray.push(el);
			}
		});
		return resultMerger(finalArray.filter(rim => rim));
	}
	if (!width && !diameter && mountingHoles) {
		const finalArray: RimInfoFromDBDTO[] = [];
		array.map(el => {
			if (el.rimConfigs?.boltPattern === mountingHoles) {
				finalArray.push(el);
			}
		});
		return resultMerger(finalArray.filter(rim => rim));
	}
	const finalArray: RimInfoFromDBDTO[] = [];
	array.map(el => {
		if (el.rimConfigs?.diameter === diameter && el.rimConfigs?.width === width && el.rimConfigs?.boltPattern === mountingHoles) {
			finalArray.push(el);
		}
	});
	return resultMerger(finalArray.filter(rim => rim));
}

export async function resultMerger(array: RimInfoFromDBDTO[]) {
	const sortedArr = respSorter(array);
	var mergedObj = (await sortedArr).reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
		const match = previous.find(el => el.rimId === next.rimId);
		if (!match) {
			previous.push(next);
		}
		if (match) {
			match.config[match.config.length] = next.config[0];
		}
		return previous;
	}, []);
	return mergedObj;
}

export function getConfigParams(array: ConfigSorterDTO[]) {
	let width: string[] = [];
	let diameter: string[] = [];
	let pcd: string[] = [];
	array.map(el => {
		if (!diameter.includes(el.rimConfigs.diameter)) {
			diameter.push(el.rimConfigs.diameter);
		}
		if (!width.includes(el.rimConfigs.width)) {
			width.push(el.rimConfigs.width);
		}
		if (!pcd.includes(el.rimConfigs.boltPattern)) {
			pcd.push(el.rimConfigs.boltPattern);
		}
	});
	return {
		diameter: diameter.sort((a, b) => Number(a) - Number(b)),
		width: width.sort((a, b) => Number(a) - Number(b)),
		mountHoles: pcd.sort(),
	};
}
