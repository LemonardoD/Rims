import { OmitedRimInfoFromDBDTO, OmitedSortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoArrPath, priceToUAH, rimsSort } from "../repoHelpers";

function respByIdSorter(array: OmitedRimInfoFromDBDTO[]): OmitedSortedRimInfoDTO[] {
	return array.map(el => {
		const uahPrice = priceToUAH(el.price!);
		el.rimConfigs.price = uahPrice;
		return {
			rimId: idConvert(el.rimId),
			brand: el.brand!,
			name: nameConn(el.name, el.nameSuff),
			config: [el.rimConfigs],
			minPrice: [uahPrice],
			diameters: [el.rimConfigs.diameter],
			images: photoArrPath(el.images),
		};
	});
}

export function rimByIdProcessor(arrayDB: OmitedRimInfoFromDBDTO[]): OmitedSortedRimInfoDTO {
	const rimAfterSort = respByIdSorter(arrayDB);
	return rimAfterSort.reduce((previous: OmitedSortedRimInfoDTO, next: OmitedSortedRimInfoDTO) => {
		if (previous.minPrice[0] > next.minPrice[0]) previous.minPrice[0] = next.minPrice[0];
		previous.config[previous.config.length] = next.config[0];
		previous.config = previous.config.sort(rimsSort);
		previous.diameters[previous.diameters.length] = next.diameters[0];
		previous.diameters = [...new Set(previous.diameters)].sort();
		return previous;
	});
}
