import { db } from "../db";
import { eq, ilike } from "drizzle-orm";
import { idConvert, newResultMerger, photoPath, priceToUAH } from "../../helpers/repoHelpers";
import { MainPgReturnRimDTO, RimConfigDTO, RimsMainSortedBrandDTO, SrchRimByConfCarDTO } from "../../DTOs/dbDTos";
import { newRim } from "../schemas/newRimConfig";
import { newRimConfig } from "../schemas/newConfig";

class Rims {
	async getNewAllRims(): Promise<MainPgReturnRimDTO[]> {
		return newResultMerger(await db.select().from(newRim));
	}

	async getNewRimsByBrand(reqRinBrand: string): Promise<MainPgReturnRimDTO[]> {
		return newResultMerger(await db.select().from(newRim).where(eq(newRim.rimBrand, reqRinBrand)));
	}

	async getNewPopularRims(): Promise<MainPgReturnRimDTO[]> {
		return newResultMerger(await db.select().from(newRim).limit(20).orderBy(newRim.pageVisits));
	}

	async getNewRimById(reqRimID: number) {
		const result = await db
			.select({ name: newRim.pageName, images: newRim.allImgs, rimVariations: newRim.rimConfigs })
			.from(newRim)
			.where(eq(newRim.rimId, reqRimID));
		return result[0];
	}

	async getNewRimsByName(name: string): Promise<RimsMainSortedBrandDTO[] | {}> {
		const rims = await db
			.select()
			.from(newRim)
			.where(ilike(newRim.pageName, `%${name}%`));
		if (rims.length) {
			return newResultMerger(rims);
		}
		return [];
	}

	async getNewRimConfigs(): Promise<RimConfigDTO> {
		const result = await db
			.select({
				diameter: newRimConfig.rimDiameter,
				width: newRimConfig.rimWidth,
				mountHoles: newRimConfig.mountingHoles,
			})
			.from(newRimConfig);
		const unique = {
			diameter: [...new Set(result.map(item => item.diameter))].sort(),
			width: [...new Set(result.map(item => item.width))].sort(),
			mountHoles: [...new Set(result.map(item => item.mountHoles))].sort(),
		};
		return unique;
	}

	async IfNewRimBrandExist(brand: string) {
		const result = await db.select().from(newRim).where(eq(newRim.rimBrand, brand));
		if (result.length) {
			return true;
		}
		return false;
	}

	async IfNewRimExist(id: number) {
		const result = await db.select().from(newRim).where(eq(newRim.rimId, id));
		if (result.length) {
			return true;
		}
		return false;
	}

	async newUpdateVisits(id: number) {
		let [{ oldPageVisits }] = await db.select({ oldPageVisits: newRim.pageVisits }).from(newRim).where(eq(newRim.rimId, id));
		if (!oldPageVisits) {
			oldPageVisits = 0;
		}
		return await db
			.update(newRim)
			.set({ pageVisits: oldPageVisits + 1 })
			.where(eq(newRim.rimId, id));
	}

	async newRimsByCar(config: SrchRimByConfCarDTO): Promise<MainPgReturnRimDTO[] | null> {
		const rims = await db
			.select({
				rimId: newRimConfig.rimId,
				diameter: newRimConfig.rimDiameter,
				width: newRimConfig.rimWidth,
				price: newRimConfig.price,
				name: newRim.pageName,
				image: newRim.miniImg,
			})
			.from(newRimConfig)
			.leftJoin(newRim, eq(newRim.rimId, newRimConfig.rimId));
		let rimRespArr: MainPgReturnRimDTO[] = [];
		rims.forEach(dbEl => {
			config.rims.forEach(reqEl => {
				if (dbEl.diameter === reqEl.diameter && dbEl.width === reqEl.width) {
					rimRespArr.push({
						rimId: idConvert(dbEl.rimId),
						name: dbEl.name,
						image: photoPath(dbEl.image),
						diameter: [dbEl.diameter],
						price: [priceToUAH(dbEl.price)],
					});
				}
			});
		});
		if (rimRespArr.length) {
			return rimRespArr;
		}
		return [];
	}

	// If we not using New table then We need to rename all of class funk W/O 'new'

	// async getAllRims() {
	// 	const result = await db
	// 		.selectDistinct({
	// 			rimId: rimConfig.rimId,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			image: rimItems.imgName,
	// 			diameter: rimConfig.rimDiameter,
	// 			price: rimConfig.priceUSD,
	// 		})
	// 		.from(rimItems)
	// 		.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
	// 	const finalResult = resultMerger(result);
	// 	return finalResult;
	// }

	// async getRimConfigs(): Promise<RimConfigDTO> {
	// 	const result = await db
	// 		.select({
	// 			diameter: rimConfig.rimDiameter,
	// 			width: rimConfig.rimWidth,
	// 			mountHoles: rimConfig.mountingHoles,
	// 		})
	// 		.from(rimConfig);
	// 	const unique = {
	// 		diameter: [...new Set(result.map(item => item.diameter))].sort(),
	// 		width: [...new Set(result.map(item => item.width))].sort(),
	// 		mountHoles: [...new Set(result.map(item => item.mountHoles))].sort(),
	// 	};
	// 	return unique;
	// }

	// async getPopularRims(): Promise<MainPgReturnRimDTO[]> {
	// 	const result = await db
	// 		.select({
	// 			rimId: rimItems.rimId,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			diameter: rimConfig.rimDiameter,
	// 			price: rimConfig.priceUSD,
	// 			image: rimItems.imgName,
	// 		})
	// 		.from(rimItems)
	// 		.limit(30)
	// 		.orderBy(rimItems.visits)
	// 		.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
	// 	const finalResult = dbRimRespSorter(result);
	// 	return finalResult
	// 		.filter((obj, index) => finalResult.findIndex(item => item.diameter === obj.diameter) === index)
	// 		.splice(0, 20);
	// }

	// async getRimsByBrand(reqRinBrand: string) {
	// 	const result = await db
	// 		.selectDistinct({
	// 			rimId: rimConfig.rimId,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			image: rimItems.imgName,
	// 			diameter: rimConfig.rimDiameter,
	// 			price: rimConfig.priceUSD,
	// 		})
	// 		.from(rimItems)
	// 		.where(eq(rimItems.rimBrand, reqRinBrand))
	// 		.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
	// 	const finalResult = resultMerger(result);
	// 	return finalResult;
	// }

	// async getConfigRimById(reqRimID: number) {
	// 	const result = await db
	// 		.select({
	// 			rimDiameter: rimConfig.rimDiameter,
	// 			rimWidth: rimConfig.rimWidth,
	// 			mountingHoles: rimConfig.mountingHoles,
	// 			priceUSD: rimConfig.priceUSD,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			images: rimItems.arrImgNames,
	// 		})
	// 		.from(rimItems)
	// 		.where(eq(rimItems.rimId, reqRimID))
	// 		.leftJoin(rimConfig, eq(rimConfig.rimId, reqRimID));
	// 	return dbSortConfigRimById(result);
	// }

	// async getRimByIdOffer(reqRimID: number): Promise<RimByIdDTO> {
	// 	const result = await db
	// 		.select({
	// 			rimAtr: offers.rimAttrs,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			images: rimItems.arrImgNames,
	// 		})
	// 		.from(rimItems)
	// 		.where(eq(rimItems.rimId, reqRimID))
	// 		.leftJoin(offers, eq(offers.itemId, reqRimID));
	// 	return dbSortOfferRimById(result);
	// }

	// async RimsByCar(config: SrchRimByConfCarDTO): Promise<MainPgReturnRimDTO[] | null> {
	// 	const rims = await db
	// 		.selectDistinct({
	// 			rimId: rimConfig.rimId,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			image: rimItems.imgName,
	// 			diameter: rimConfig.rimDiameter,
	// 			width: rimConfig.rimWidth,
	// 			price: rimConfig.priceUSD,
	// 		})
	// 		.from(rimItems)
	// 		.where(eq(rimItems.rimId, rimConfig.rimId))
	// 		.leftJoin(rimConfig, eq(rimConfig.mountingHoles, config.pcd));
	// 	let rimRespArr: MainPgReturnRimDTO[] = [];
	// 	if (rims.length) {
	// 		rims.forEach(dbEl => {
	// 			config.rims.forEach(reqEl => {
	// 				if (dbEl.diameter === reqEl.diameter && dbEl.width === reqEl.width) {
	// 					rimRespArr.push({
	// 						rimId: idConvert(dbEl.rimId),
	// 						name: nameConnector(dbEl.rimBrand, dbEl.rimName, dbEl.rimAttrs?.name_suffix),
	// 						image: photoPath(dbEl.image),
	// 						diameter: [dbEl.diameter],
	// 						price: [priceToUAH(dbEl.price)],
	// 					});
	// 				}
	// 			});
	// 		});
	// 		return rimRespArr;
	// 	}
	// 	return [];
	// }

	// async RimsByName(name: string): Promise<RimsMainSortedBrandDTO[] | {}> {
	// 	const rims = await db
	// 		.select({
	// 			rimId: rimConfig.rimId,
	// 			rimBrand: rimItems.rimBrand,
	// 			rimName: rimItems.rimName,
	// 			rimAttrs: rimItems.rimAttrs,
	// 			image: rimItems.imgName,
	// 			diameter: rimConfig.rimDiameter,
	// 			price: rimConfig.priceUSD,
	// 		})
	// 		.from(rimItems)
	// 		.where(or(ilike(rimItems.rimName, `%${name}%`), ilike(rimItems.rimBrand, `%${name}%`)))
	// 		.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
	// 	if (rims.length) {
	// 		return resultMerger(rims);
	// 	}
	// 	return [];
	// }

	// async IfRimBrandExist(brand: string) {
	// 	const result = await db.select().from(rimItems).where(eq(rimItems.rimBrand, brand));
	// 	if (result.length) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	// async IfRimExist(id: number) {
	// 	const result = await db.select().from(rimItems).where(eq(rimItems.rimId, id));
	// 	if (result.length) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	// async updateVisits(id: number) {
	// 	let [{ visitsCount }] = await db.select({ visitsCount: rimItems.visits }).from(rimItems).where(eq(rimItems.rimId, id));
	// 	if (!visitsCount) {
	// 		visitsCount = 0;
	// 	}
	// 	return await db
	// 		.update(rimItems)
	// 		.set({ visits: visitsCount + 1 })
	// 		.where(eq(rimItems.rimId, id));
	// }
}
export default new Rims();
