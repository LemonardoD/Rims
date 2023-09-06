// import { RimInfoFromDBDTO } from "../../DTOs/dbDTos";
// import { ConfigDTO } from "../../DTOs/otherDTOs";
// import { resultProcessor } from "./basicProcessor";

// export function resultConfigProcessor(array: RimInfoFromDBDTO[], config: ConfigDTO) {
// 	const finalArray: RimInfoFromDBDTO[] = [];
// 	let { width, diameter, mountingHoles } = config;
// 	if (width && diameter && !mountingHoles) {
// 		array.map(el => {
// 			if (el.rimConfigs?.diameter === diameter && (el.rimConfigs.width === `${width}.0` || el.rimConfigs.width === width)) {
// 				finalArray.push(el);
// 			}
// 		});
// 	}
// 	if (!width && diameter && mountingHoles) {
// 		array.map(el => {
// 			if (el.rimConfigs?.diameter === diameter && el.rimConfigs.boltPattern === mountingHoles) {
// 				finalArray.push(el);
// 			}
// 		});
// 	}
// 	if (width && !diameter && mountingHoles) {
// 		array.map(el => {
// 			if (
// 				(el.rimConfigs?.width === `${width}.0` || el.rimConfigs?.width === width) &&
// 				el.rimConfigs.boltPattern === mountingHoles
// 			) {
// 				finalArray.push(el);
// 			}
// 		});
// 	}
// 	if (width && !diameter && !mountingHoles) {
// 		array.map(el => {
// 			if (el.rimConfigs?.width === `${width}.0` || el.rimConfigs?.width === width) {
// 				finalArray.push(el);
// 			}
// 		});
// 	}
// 	if (!width && diameter && !mountingHoles) {
// 		array.map(el => {
// 			if (el.rimConfigs?.diameter === diameter) {
// 				finalArray.push(el);
// 			}
// 		});
// 	}
// 	if (!width && !diameter && mountingHoles) {
// 		array.map(el => {
// 			if (el.rimConfigs?.boltPattern === mountingHoles) {
// 				finalArray.push(el);
// 			}
// 		});
// 	}
// 	array.map(el => {
// 		if (
// 			el.rimConfigs?.diameter === diameter &&
// 			(el.rimConfigs.width === `${width}.0` || el.rimConfigs.width === width) &&
// 			el.rimConfigs.boltPattern === mountingHoles
// 		) {
// 			finalArray.push(el);
// 		}
// 	});
// 	return resultProcessor(finalArray);
// }
