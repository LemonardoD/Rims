import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { rimConfig } from "../schemas/rimConfigSchema";
import { tableRims } from "../schemas/rimsSchema";
import { nameConnector, photoPath, priceToUAH, stringConverter, photoArrPath } from "../../helpers/lilHelpers";
import {
	MainPgReturnRimDTO,
	RimById,
	RimConfigDTO,
	RimsByBrand,
	SearchRimByConfDto,
	SrchRimByConfCarDto,
} from "../../DTOs/dbDTos";
import { rimItems } from "../schemas/rimItemsSchema";

class Rims {
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

	async getAllRims() {
		const result = await db
			.selectDistinct({
				rimId: rimConfig.rimId,
				rimBrand: tableRims.rimBrandName,
				rimName: tableRims.rimShortName,
				image: tableRims.rimThumbnail,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(tableRims)
			.leftJoin(rimConfig, eq(rimConfig.rimId, tableRims.RimsId));

		let finalResult = [];
		for (let i = 0; i < result.length; i++) {
			finalResult.push({
				rimId: stringConverter(result[i].rimId),
				name: nameConnector(result[i].rimBrand, result[i].rimName),
				image: photoPath(result[i].image),
				diameter: result[i].diameter,
				price: priceToUAH(result[i].price),
			});
		}
		return finalResult.filter(rim => rim.rimId !== null);
	}

	async getRimsByBrand(reqRinBrand: string): Promise<RimsByBrand[]> {
		const result = await db
			.selectDistinct({
				rimId: rimConfig.rimId,
				rimBrand: tableRims.rimBrandName,
				rimName: tableRims.rimShortName,
				image: tableRims.rimThumbnail,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(tableRims)
			.where(eq(tableRims.rimBrandName, reqRinBrand))
			.leftJoin(rimConfig, eq(rimConfig.rimId, tableRims.RimsId));
		let finalResult = [];
		for (let i = 0; i < result.length; i++) {
			finalResult.push({
				rimId: stringConverter(result[i].rimId),
				name: nameConnector(result[i].rimBrand, result[i].rimName),
				image: photoPath(result[i].image),
				diameter: result[i].diameter,
				price: priceToUAH(result[i].price),
			});
		}
		return finalResult.filter(rim => rim.rimId !== null);
	}

	async getRimById(reqRimID: number): Promise<RimById> {
		const result = await db
			.select({
				rimDiameter: rimConfig.rimDiameter,
				rimWidth: rimConfig.rimWidth,
				mountingHoles: rimConfig.mountingHoles,
				priceUSD: rimConfig.priceUSD,
				rimBrand: tableRims.rimBrandName,
				rimName: tableRims.rimShortName,
				images: tableRims.rimImg,
			})
			.from(tableRims)
			.where(eq(tableRims.RimsId, reqRimID))
			.leftJoin(rimConfig, eq(rimConfig.rimId, reqRimID));
		const [{ mountingHoles, priceUSD, rimBrand, rimName, images }] = result;
		let width: string[] = [];
		let diameter: string[] = [];
		result.map(el => {
			if (el.rimWidth && !width.includes(el.rimWidth)) {
				width.push(el.rimWidth);
			}
			if (el.rimDiameter && !diameter.includes(el.rimDiameter)) {
				diameter.push(el.rimDiameter);
			}
		});
		return {
			name: nameConnector(rimBrand, rimName),
			width,
			diameter,
			mountingHoles: mountingHoles,
			price: priceToUAH(priceUSD),
			images: photoArrPath(images),
		};
	}

	async getPopularRims(): Promise<MainPgReturnRimDTO[]> {
		const result = await db
			.select({
				rimId: rimItems.rimId,
				rimBrand: rimItems.rimBrand,
				rimName: rimItems.rimName,
				rimDiameter: rimConfig.rimDiameter,
				priceUSD: rimConfig.priceUSD,
				image: rimItems.imgName,
			})
			.from(rimItems)
			.limit(20)
			.orderBy(rimItems.visits)
			.leftJoin(rimConfig, eq(rimConfig.rimId, rimItems.rimId));
		let finalResult: MainPgReturnRimDTO[] = [];
		for (let i = 0; i < result.length; i++) {
			finalResult.push({
				rimId: stringConverter(result[i].rimId),
				name: nameConnector(result[i].rimBrand, result[i].rimName),
				image: photoPath(result[i].image),
				diameter: result[i].rimDiameter,
				price: priceToUAH(result[i].priceUSD),
			});
		}
		return finalResult.filter(rim => rim.rimId !== null);
	}

	async RimsByConfigFromCar(config: SrchRimByConfCarDto): Promise<MainPgReturnRimDTO[] | null> {
		const rims = await db
			.selectDistinct({
				rimId: rimConfig.rimId,
				rimBrand: tableRims.rimBrandName,
				rimName: tableRims.rimShortName,
				image: tableRims.rimThumbnail,
				diameter: rimConfig.rimDiameter,
				width: rimConfig.rimWidth,
				price: rimConfig.priceUSD,
			})
			.from(tableRims)
			.where(eq(tableRims.RimsId, rimConfig.rimId))
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

	async RimsByConfig(config: SearchRimByConfDto): Promise<MainPgReturnRimDTO[] | null> {
		const rims = await db
			.select({
				rimId: rimConfig.rimId,
				rimBrand: tableRims.rimBrandName,
				rimName: tableRims.rimShortName,
				image: tableRims.rimThumbnail,
				diameter: rimConfig.rimDiameter,
				price: rimConfig.priceUSD,
			})
			.from(tableRims)
			.where(eq(tableRims.RimsId, rimConfig.rimId))
			.leftJoin(
				rimConfig,
				and(
					eq(rimConfig.mountingHoles, config.mountHoles),
					eq(rimConfig.rimWidth, config.width),
					eq(rimConfig.rimDiameter, config.diameter),
				),
			);
		if (rims.length) {
			let finalResult: MainPgReturnRimDTO[] = [];
			for (let i = 0; i < rims.length; i++) {
				finalResult.push({
					rimId: stringConverter(rims[i].rimId),
					name: nameConnector(rims[i].rimBrand, rims[i].rimName),
					image: photoPath(rims[i].image),
					diameter: rims[i].diameter,
					price: priceToUAH(rims[i].price),
				});
			}
			return finalResult;
		}

		return null;
	}

	async IfRimBrandExist(brand: string) {
		const result = await db.select().from(tableRims).where(eq(tableRims.rimBrandName, brand));
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

	async IfRimsExist(id: number) {
		const result = await db.select().from(tableRims).where(eq(tableRims.RimsId, id));
		if (result.length) {
			return true;
		}
		return false;
	}
}
export default new Rims();
