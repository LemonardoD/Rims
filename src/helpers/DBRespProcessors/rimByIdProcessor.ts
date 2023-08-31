import { RimByIdInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { RimByIdSortedDTO } from "../../DTOs/otherDTOs";
import { idConvert, nameConn, photoArrPath, priceToUAH } from "../repoHelpers";
import { rimConfigSorter } from "./basicProcessor";

function respByIdSorter(array: RimByIdInfoFromDBDTO[]) {
	const rim = array.map(el => {
		let objElement: SortedRimInfoDTO = {
			rimId: idConvert(el.rimId),
			brand: el.brand as string,
			name: nameConn(el.name, el.nameSuff),
			config: [],
			minPrice: [],
			diameters: [],
			images: photoArrPath(el.images),
		};
		const uahPrice = priceToUAH(el.price as number);
		let newConfig = el.rimConfigs;
		if (newConfig) {
			newConfig.price = uahPrice;
			(objElement.config = [newConfig]), (objElement.minPrice = [uahPrice]), (objElement.diameters = [newConfig.diameter]);
		}
		return objElement;
	});
	return rim;
}

export function rimByIdProcessor(arrayDB: RimByIdInfoFromDBDTO[]): RimByIdSortedDTO {
	const rimAfterSort = respByIdSorter(arrayDB);
	const [{ oldPageVisits }] = arrayDB;
	if (!rimAfterSort[0].config) {
		return { rim: rimAfterSort[0], oldPageVisits };
	}
	const rim = rimAfterSort.reduce((previous: SortedRimInfoDTO, next: SortedRimInfoDTO) => {
		if (previous.minPrice[0] > next.minPrice[0]) previous.minPrice[0] = next.minPrice[0];
		previous.config[previous.config.length] = next.config[0];
		previous.config = previous.config.sort(rimConfigSorter);
		previous.diameters[previous.diameters.length] = next.diameters[0];
		previous.diameters = [...new Set(previous.diameters)].sort();
		return previous;
	});
	return { rim, oldPageVisits };
}
