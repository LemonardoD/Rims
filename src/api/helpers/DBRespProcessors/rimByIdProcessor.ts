import { RimInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoArrPath, priceToUAH } from "../repoHelpers";
import { rimConfigSorter } from "./basicProcessor";

function respByIdSorter(array: RimInfoFromDBDTO[]) {
	const rim = array.map(el => {
		let objElement: SortedRimInfoDTO = {
			rimId: idConvert(el.rimId),
			brand: el.brand!,
			name: nameConn(el.name, el.nameSuff),
			config: [],
			minPrice: [],
			diameters: [],
			images: photoArrPath(el.images!),
		};
		let newConfig = el.rimConfigs;
		if (newConfig) {
			const uahPrice = priceToUAH(el.price!);
			newConfig.price = uahPrice;
			(objElement.config = [newConfig]), (objElement.minPrice = [uahPrice]), (objElement.diameters = [newConfig.diameter]);
		}
		return objElement;
	});
	return rim;
}

export function rimByIdProcessor(arrayDB: RimInfoFromDBDTO[]): SortedRimInfoDTO {
	const rimAfterSort = respByIdSorter(arrayDB);
	if (!rimAfterSort[0].config) {
		return rimAfterSort[0];
	}
	return rimAfterSort.reduce((previous: SortedRimInfoDTO, next: SortedRimInfoDTO) => {
		if (previous.minPrice[0] > next.minPrice[0]) previous.minPrice[0] = next.minPrice[0];
		previous.config[previous.config.length] = next.config[0];
		previous.config = previous.config.sort(rimConfigSorter);
		previous.diameters[previous.diameters.length] = next.diameters[0];
		previous.diameters = [...new Set(previous.diameters)].sort();
		return previous;
	});
}
