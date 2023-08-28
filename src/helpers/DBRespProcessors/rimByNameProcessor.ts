import { RimInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoPath, priceToUAH } from "../repoHelpers";
import { resultProcessor } from "./basicProcessor";

function rimByNameSorter(array: RimInfoFromDBDTO[]): SortedRimInfoDTO[] {
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
				image: photoPath(array[i].image),
			};
			result.push(objElement);
		}
		if (!newConfig) {
			result.push({
				rimId: idConvert(array[i].rimId),
				brand: array[i].brand,
				name: nameConn(array[i].name, array[i].nameSuff),
				config: [],
				minPrice: [],
				diameters: [],
				image: photoPath(array[i].image),
			});
		}
	}
	return result;
}
export function rimByNameProcessor(array: RimInfoFromDBDTO[]) {
	const mergedObj = rimByNameSorter(array).reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
		const match = previous.find(el => el.rimId === next.rimId);
		if (!match) previous.push(next);
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
