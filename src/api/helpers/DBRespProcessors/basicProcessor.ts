import { RimInfoFromDBDTO, SortedRimInfoDTO } from "../../DTOs/dbDTos";
import { idConvert, nameConn, photoPath, priceToUAH, rimsSort } from "../repoHelpers";

export function respSorter(array: RimInfoFromDBDTO[]): SortedRimInfoDTO[] {
	return array.map(el => {
		const uahPrice = priceToUAH(el.price!);
		el.rimConfigs.price = uahPrice;
		return {
			rimId: idConvert(el.rimId),
			brand: el.brand,
			name: nameConn(el.name, el.nameSuff),
			config: [el.rimConfigs],
			minPrice: [uahPrice],
			diameters: [el.rimConfigs.diameter],
			image: photoPath(el.image),
		};
	});
}
export function resultProcessor(array: RimInfoFromDBDTO[]) {
	let uniqDiameters: string[] = [];
	const mergedObj: SortedRimInfoDTO[] = respSorter(array).reduce((previous: SortedRimInfoDTO[], next: SortedRimInfoDTO) => {
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
			match.config = match.config.sort(rimsSort);
			match.diameters[match.diameters.length] = next.diameters[0];
			match.diameters = [...new Set(match.diameters)].sort();
		}
		return previous;
	}, []);
	return { rimList: mergedObj, diameters: [...new Set(uniqDiameters)].sort() };
}
