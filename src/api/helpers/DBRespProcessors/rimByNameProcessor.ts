import { RimInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoPath, priceToUAH } from "../repoHelpers";
import { rimConfigSorter } from "./basicProcessor";

function rimByNameSorter(array: RimInfoFromDBDTO[]): SortedRimInfoDTO[] {
	return array.map(el => {
		let objElement: SortedRimInfoDTO = {
			rimId: idConvert(el.rimId),
			brand: el.brand!,
			name: nameConn(el.name, el.nameSuff),
			config: [],
			minPrice: [],
			diameters: [],
			image: photoPath(el.image!),
		};
		let newConfig = el.rimConfigs;
		if (newConfig) {
			const uahPrice = priceToUAH(el.price!);
			newConfig.price = uahPrice;
			(objElement.config = [newConfig]), (objElement.minPrice = [uahPrice]), (objElement.diameters = [newConfig.diameter]);
		}
		return objElement;
	});
}

export function rimByNameProcessor(array: RimInfoFromDBDTO[]): SortedRimInfoDTO[] {
	return rimByNameSorter(array).reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
		const match = previous.find(el => el.rimId === next.rimId);
		if (!match) previous.push(next);
		if (match) {
			if (match.minPrice[0] > next.minPrice[0]) match.minPrice[0] = next.minPrice[0];
			match.config[match.config.length] = next.config[0];
			match.config = match.config.sort(rimConfigSorter);
			match.diameters[match.diameters.length] = next.diameters[0];
			match.diameters = [...new Set(match.diameters)].sort();
		}
		return previous;
	}, []);
}
