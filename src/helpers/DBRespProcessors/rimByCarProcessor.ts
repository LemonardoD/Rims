import { RimInfoFromDBDTO, SrchRimByConfCarDTO } from "../../DTOs/dbDTos";
import { resultProcessor } from "./basicProcessor";

export function rimByCarProcessor(array: RimInfoFromDBDTO[], config: SrchRimByConfCarDTO) {
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
	return resultProcessor(finalArray);
}
