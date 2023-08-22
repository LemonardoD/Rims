import * as dotenv from "dotenv";
dotenv.config();
import { ConfigDTO } from "../DTOs/otherDTOs";
import { getUsdExchange } from "../database/repositories/exchangeRepo";
import { RimInfoFromDBDTO, SortedRimInfoDTO, SrchRimByConfCarDTO, SortedRimByCarInfoDTO } from "../DTOs/dbDTos";

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
	if (str1 && !str2) {
		return `${str1}`;
	}
	return str1 as string;
}

export function idConvert(number: number | bigint | null) {
	return number?.toString() as string;
}

export function respSorter(array: RimInfoFromDBDTO[]): SortedRimInfoDTO[] {
	let result: SortedRimInfoDTO[] = [];
	for (let i = 0; i < array.length; i++) {
		const price = priceToUAH(array[i].price as number);
		let newConfig = array[i].rimConfigs;
		if (newConfig) {
			newConfig.price = price;
			let objElement: SortedRimInfoDTO = {
				rimId: idConvert(array[i].rimId),
				brand: array[i].brand,
				name: nameConn(array[i].name, array[i].nameSuff),
				config: [newConfig],
				minPrice: [price],
				diameters: [newConfig.diameter],
			};
			if (array[i].images) {
				objElement.images = photoArrPath(array[i].images);
			}
			if (array[i].image) {
				objElement.image = photoPath(array[i].image);
			}
			result.push(objElement);
		}
	}
	return result;
}

export function resultMerger(array: RimInfoFromDBDTO[]) {
	const sortedArr = respSorter(array);
	let uniqDiameters: string[] = [];
	const mergedObj = sortedArr.reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
		const match = previous.find(el => el.rimId === next.rimId);
		if (!match) {
			uniqDiameters.push(next.config[0].diameter);
			previous.push(next);
		}
		if (match) {
			if (match.minPrice[0] > next.minPrice[0]) {
				match.minPrice[0] = next.minPrice[0];
			}
			uniqDiameters.push(next.config[0].diameter);
			match.config[match.config.length] = next.config[0];
			match.diameters[match.diameters.length] = next.diameters[0];
			match.diameters = [...new Set(match.diameters)].sort();
		}
		return previous;
	}, []);
	return { rimList: mergedObj, diameters: [...new Set(uniqDiameters)].sort() };
}

export function resultMergerConfig(array: RimInfoFromDBDTO[], config: ConfigDTO) {
	const finalArray: RimInfoFromDBDTO[] = [];
	const { width, diameter, mountingHoles } = config;
	if (width && diameter && !mountingHoles) {
		array.map(el => {
			if (el.rimConfigs?.diameter === diameter && (el.rimConfigs.width === `${width}.0` || el.rimConfigs.width === width)) {
				finalArray.push(el);
			}
		});
	}
	if (!width && diameter && mountingHoles) {
		array.map(el => {
			if (el.rimConfigs?.diameter === diameter && el.rimConfigs.boltPattern === mountingHoles) {
				finalArray.push(el);
			}
		});
	}
	if (width && !diameter && mountingHoles) {
		array.map(el => {
			if (
				(el.rimConfigs?.width === `${width}.0` || el.rimConfigs?.width === width) &&
				el.rimConfigs.boltPattern === mountingHoles
			) {
				finalArray.push(el);
			}
		});
	}
	if (width && !diameter && !mountingHoles) {
		array.map(el => {
			if (el.rimConfigs?.width === `${width}.0` || el.rimConfigs?.width === width) {
				finalArray.push(el);
			}
		});
	}
	if (!width && diameter && !mountingHoles) {
		array.map(el => {
			if (el.rimConfigs?.diameter === diameter) {
				finalArray.push(el);
			}
		});
	}
	if (!width && !diameter && mountingHoles) {
		array.map(el => {
			if (el.rimConfigs?.boltPattern === mountingHoles) {
				finalArray.push(el);
			}
		});
	}
	array.map(el => {
		if (
			el.rimConfigs?.diameter === diameter &&
			(el.rimConfigs.width === `${width}.0` || el.rimConfigs.width === width) &&
			el.rimConfigs.boltPattern === mountingHoles
		) {
			finalArray.push(el);
		}
	});
	return resultMerger(finalArray);
}

export function rimByCarMerger(array: RimInfoFromDBDTO[], config: SrchRimByConfCarDTO) {
	let rimRespArr: RimInfoFromDBDTO[] = [];
	array.forEach(dbEl => {
		config.rims.forEach(async reqEl => {
			if (
				dbEl.rimConfigs?.boltPattern === config.pcd &&
				dbEl.rimConfigs.diameter === reqEl.diameter &&
				(dbEl.rimConfigs.width === `${reqEl.width}.0` || dbEl.rimConfigs.width === reqEl.width)
			) {
				rimRespArr.push(dbEl);
			}
		});
	});
	return resultMerger(rimRespArr);
}

// export function getConfigParams(array: ConfigSorterDTO[]) {
// 	let width: string[] = [];
// 	let diameter: string[] = [];
// 	let pcd: string[] = [];
// 	array.map(el => {
// 		if (!diameter.includes(el.rimConfigs.diameter)) {
// 			diameter.push(el.rimConfigs.diameter);
// 		}
// 		if (!width.includes(el.rimConfigs.width)) {
// 			width.push(el.rimConfigs.width);
// 		}
// 		if (!pcd.includes(el.rimConfigs.boltPattern)) {
// 			pcd.push(el.rimConfigs.boltPattern);
// 		}
// 	});
// 	return {
// 		diameter: diameter.sort((a, b) => Number(a) - Number(b)),
// 		width: width.sort((a, b) => Number(a) - Number(b)),
// 		mountHoles: pcd.sort(),
// 	};
// }
