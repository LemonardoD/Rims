import { RimInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoArrPath, priceToUAH } from "../repoHelpers";
import { rimConfigSorter } from "./basicProcessor";

function respByIdSorter(array: RimInfoFromDBDTO[]): SortedRimInfoDTO[] {
	let result: SortedRimInfoDTO[] = [];
	for (let i = 0; i < array.length; i++) {
		const uahPrice = priceToUAH(array[i].price as number);
		let newConfig = array[i].rimConfigs;
		if (newConfig) {
			newConfig.price = uahPrice;
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
	return result;
}

export function rimByIdProcessor(array: RimInfoFromDBDTO[]) {
	if (array.length === 1 && array[0].rimConfigs === null) {
		return {
			rimId: idConvert(array[0].rimId),
			brand: array[0].brand,
			name: nameConn(array[0].name, array[0].nameSuff),
			config: [],
			minPrice: [],
			diameters: [],
			images: photoArrPath(array[0].images),
		};
	}
	const mergedObj = respByIdSorter(array).reduce((previous: SortedRimInfoDTO, next: SortedRimInfoDTO) => {
		if (previous.minPrice[0] > next.minPrice[0]) previous.minPrice[0] = next.minPrice[0];
		previous.config[previous.config.length] = next.config[0];
		previous.config = previous.config.sort(rimConfigSorter);
		previous.diameters[previous.diameters.length] = next.diameters[0];
		previous.diameters = [...new Set(previous.diameters)].sort();
		return previous;
	});
	return mergedObj;
}
