import { db } from "../db";
import { eq, or, ilike } from "drizzle-orm";
import { rimConfig } from "../schemas/rimConfigSchema";
import { tableRims } from "../schemas/rimsSchema";
import { nameConnector, photoPath, priceToUAH, stringConverter, dbSorter, dbSorterRimById } from "../../helpers/repoHelpers";
import { MainPgReturnRimDTO, RimConfigDTO, RimsMainSortedBrand, SrchRimByConfCarDto } from "../../DTOs/dbDTos";
import { rimItems } from "../schemas/rimItemsSchema";

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
		const finalResult = dbSorter(result);
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
			.limit(20)
			.orderBy(rimItems.visits)
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		const finalResult = dbSorter(result);
		return finalResult;
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
		const finalResult = dbSorter(result);
		return finalResult;
	}

	async getRimById(reqRimID: number) {
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
		return dbSorterRimById(result);
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

	async RimsByCar(config: SrchRimByConfCarDto): Promise<MainPgReturnRimDTO[] | null> {
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
							rimId: stringConverter(dbEl.rimId),
							name: nameConnector(dbEl.rimBrand, dbEl.rimName),
							image: photoPath(dbEl.image),
							diameter: dbEl.diameter,
							price: priceToUAH(dbEl.price),
						});
					}
				});
			});
			return rimRespArr;
		}
		return null;
	}

	async RimsByName(name: string): Promise<RimsMainSortedBrand[] | null> {
		const rims = await db
			.select({
				rimId: rimConfig.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				image: rimItems.imgName,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(rimItems)
			.where(or(ilike(rimItems.rimName, `%${name}%`), ilike(rimItems.rimBrand, `%${name}%`)))
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		rims.map(el => console.log(el.rimName));
		if (rims.length) {
			return dbSorter(rims);
		}
		console.log(name);
		return null;
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
