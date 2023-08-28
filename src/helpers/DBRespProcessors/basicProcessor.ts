import { RimInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoPath, priceToUAH } from "../repoHelpers";

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

export function resultProcessor(array: RimInfoFromDBDTO[]) {
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
