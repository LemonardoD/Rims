import { db } from "../db";
import { eq, or, ilike } from "drizzle-orm";
import { rimConfig } from "../schemas/rimConfigSchema";
import {
	nameConnector,
	photoPath,
	priceToUAH,
	idConvert,
	dbRimRespSorter,
	dbSortConfigRimById,
	resultMerger,
	dbSortOfferRimById,
} from "../../helpers/repoHelpers";
import { MainPgReturnRimDTO, RimByIdDTO, RimConfigDTO, RimsMainSortedBrandDTO, SrchRimByConfCarDTO } from "../../DTOs/dbDTos";
import { rimItems } from "../schemas/rimItemsSchema";
import { offers } from "../schemas/ofersSchema";

class Rims {
	async getAllRims() {
		const result = await db
			.selectDistinct({
				rimId: rimConfig.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				image: rimItems.imgName,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(rimItems)
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		const finalResult = resultMerger(result);
		return finalResult;
	}

	async getPopularRims(): Promise<MainPgReturnRimDTO[]> {
		const result = await db
			.select({
				rimId: rimItems.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
				image: rimItems.imgName,
			})
			.from(rimItems)
			.limit(30)
			.orderBy(rimItems.visits)
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		const finalResult = dbRimRespSorter(result);
		return finalResult
			.filter((obj, index) => finalResult.findIndex(item => item.diameter === obj.diameter) === index)
			.splice(0, 20);
	}

	async getRimsByBrand(reqRinBrand: string) {
		const result = await db
			.selectDistinct({
				rimId: rimConfig.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				image: rimItems.imgName,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(rimItems)
			.where(eq(rimItems.rimBrand, reqRinBrand))
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		const finalResult = resultMerger(result);
		return finalResult;
	}

	async getConfigRimById(reqRimID: number) {
		const result = await db
			.select({
				rimDiameter: rimConfig.rimDiameter,
				rimWidth: rimConfig.rimWidth,
				mountingHoles: rimConfig.mountingHoles,
				priceUSD: rimConfig.priceUSD,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				images: rimItems.arrImgNames,
			})
			.from(rimItems)
			.where(eq(rimItems.rimId, reqRimID))
			.leftJoin(rimConfig, eq(rimConfig.rimId, reqRimID));
		return dbSortConfigRimById(result);
	}

	async getRimByIdOffer(reqRimID: number): Promise<RimByIdDTO> {
		const result = await db
			.select({
				rimAtr: offers.rimAttrs,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				images: rimItems.arrImgNames,
			})
			.from(rimItems)
			.where(eq(rimItems.rimId, reqRimID))
			.leftJoin(offers, eq(offers.itemId, reqRimID));
		return dbSortOfferRimById(result);
	}

	async getRimConfigs(): Promise<RimConfigDTO> {
		const result = await db
			.select({
				diameter: rimConfig.rimDiameter,
				width: rimConfig.rimWidth,
				mountHoles: rimConfig.mountingHoles,
			})
			.from(rimConfig);
		const unique = {
			diameter: [...new Set(result.map(item => item.diameter))].sort(),
			width: [...new Set(result.map(item => item.width))].sort(),
			mountHoles: [...new Set(result.map(item => item.mountHoles))].sort(),
		};
		return unique;
	}

	async RimsByCar(config: SrchRimByConfCarDTO): Promise<MainPgReturnRimDTO[] | null> {
		const rims = await db
			.selectDistinct({
				rimId: rimConfig.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				image: rimItems.imgName,
				diameter: rimConfig.rimDiameter,
				width: rimConfig.rimWidth,
				price: rimConfig.priceUSD,
			})
			.from(rimItems)
			.where(eq(rimItems.rimId, rimConfig.rimId))
			.leftJoin(rimConfig, eq(rimConfig.mountingHoles, config.pcd));
		let rimRespArr: MainPgReturnRimDTO[] = [];
		if (rims.length) {
			rims.forEach(dbEl => {
				config.rims.forEach(reqEl => {
					if (dbEl.diameter === reqEl.diameter && dbEl.width === reqEl.width) {
						rimRespArr.push({
							rimId: idConvert(dbEl.rimId),
							name: nameConnector(dbEl.rimBrand, dbEl.rimName),
							image: photoPath(dbEl.image),
							diameter: [dbEl.diameter],
							price: [priceToUAH(dbEl.price)],
						});
					}
				});
			});
			return rimRespArr;
		}
		return [];
	}

	async RimsByName(name: string): Promise<RimsMainSortedBrandDTO[] | {}> {
		const rims = await db
			.select({
				rimId: rimConfig.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				rimAttrs: rimItems.rimAttrs,
				image: rimItems.imgName,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(rimItems)
			.where(or(ilike(rimItems.rimName, `%${name}%`), ilike(rimItems.rimBrand, `%${name}%`)))
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		if (rims.length) {
			return resultMerger(rims);
		}
		return [];
	}

	async IfRimBrandExist(brand: string) {
		const result = await db.select().from(rimItems).where(eq(rimItems.rimBrand, brand));
		if (result.length) {
			return true;
		}
		return false;
	}

	async IfRimExist(id: number) {
		const result = await db.select().from(rimItems).where(eq(rimItems.rimId, id));
		if (result.length) {
			return true;
		}
		return false;
	}

	async updateVisits(id: number) {
		let [{ visitsCount }] = await db.select({ visitsCount: rimItems.visits }).from(rimItems).where(eq(rimItems.rimId, id));
		if (!visitsCount) {
			visitsCount = 0;
		}
		return await db
			.update(rimItems)
			.set({ visits: visitsCount + 1 })
			.where(eq(rimItems.rimId, id));
	}
}
export default new Rims();
