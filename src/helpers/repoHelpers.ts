import * as dotenv from "dotenv";
dotenv.config();
import { ConfigDTO } from "../DTOs/otherDTOs";
import { getUsdExchange } from "../database/repositories/exchangeRepo";
import { RimInfoFromDBDTO, SortedRimInfoDTO, SrchRimByConfCarDTO } from "../DTOs/dbDTos";

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
				image: photoPath(array[i].image),
			};
			result.push(objElement);
		}
	}
	return result;
}

export function resultMerger(array: RimInfoFromDBDTO[]) {
	let uniqDiameters: string[] = [];
	const mergedObj = respSorter(array).reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
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

export function rimByNameMerger(array: RimInfoFromDBDTO[]) {
	return array.map(el => {
		let newConfig = el.rimConfigs;
		if (newConfig) {
			const price = priceToUAH(el.price as number);
			newConfig.price = price;
			return {
				rimId: idConvert(el.rimId),
				brand: el.brand,
				name: nameConn(el.name, el.nameSuff),
				config: [newConfig],
				minPrice: [price],
				diameters: [newConfig.diameter],
				image: photoPath(el.image),
			};
		}
		return {
			rimId: idConvert(el.rimId),
			brand: el.brand,
			name: nameConn(el.name, el.nameSuff),
			image: photoPath(el.image),
		};
	});
}

export function rimByIdMerger(array: RimInfoFromDBDTO[]) {
	let result: SortedRimInfoDTO[] = [];
	for (let i = 0; i < array.length; i++) {
		const uahPrice = priceToUAH(array[i].price as number);
		let newConfig = array[i].rimConfigs;
		if (newConfig) {
			let objElement: SortedRimInfoDTO = {
				rimId: idConvert(array[i].rimId),
				brand: array[i].brand,
				name: nameConn(array[i].name, array[i].nameSuff),
				config: [newConfig],
				minPrice: [uahPrice],
				diameters: [newConfig.diameter],
				images: photoArrPath(array[i].images),
			};
			result.push(objElement);
		}
	}
	if (result.length === 1) {
		return result[0];
	}
	const mergedObj = result.reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
		const match = previous.find(el => el.rimId === next.rimId);
		if (!match) {
			previous.push(next);
		}
		if (match) {
			if (match.minPrice[0] > next.minPrice[0]) {
				match.minPrice[0] = next.minPrice[0];
			}
			match.config[match.config.length] = next.config[0];
			match.diameters[match.diameters.length] = next.diameters[0];
			match.diameters = [...new Set(match.diameters)].sort();
		}
		return previous;
	}, []);
	return mergedObj;
}

export function rimByCarMerger(array: RimInfoFromDBDTO[], config: SrchRimByConfCarDTO) {
	let finalArray: RimInfoFromDBDTO[] = [];
	array.forEach(dbEl => {
		config.rims.forEach(async reqEl => {
			if (
				dbEl.rimConfigs?.boltPattern === config.pcd &&
				dbEl.rimConfigs.diameter === reqEl.diameter &&
				(dbEl.rimConfigs.width === `${reqEl.width}.0` || dbEl.rimConfigs.width === reqEl.width)
			) {
				finalArray.push(dbEl);
			}
		});
	});
	return resultMerger(finalArray);
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
