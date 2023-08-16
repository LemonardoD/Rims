import { db } from "../db";
import { eq, ilike, gt, and, or, desc } from "drizzle-orm";
import {
	getConfigParams,
	idConvert,
	nameConn,
	photoPath,
	priceToUAH,
	resultMerger,
	resultMergerConfig,
} from "../../helpers/repoHelpers";
import { SrchRimByConfCarDTO } from "../../DTOs/dbDTos";
import { vendors } from "../schemas/vendorSchema";
import { rims } from "../schemas/rimsSchema";
import { images } from "../schemas/imagesSchema";
import { rimConfigs } from "../schemas/rimConfigsSchema";
import { ConfigDTO } from "../../DTOs/otherDTOs";

class Rims {
	async getAllRims() {
		return resultMerger(
			await db
				.select({
					rimId: rims.rimId,
					brand: rims.brand,
					name: rims.rimName,
					nameSuff: rims.rimNameSuffix,
					image: images.miniImg,
					rimConfigs: rimConfigs.configurations,
					price: vendors.price,
				})
				.from(vendors)
				.where(and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
				.leftJoin(rims, eq(rims.rimId, vendors.rimId))
				.leftJoin(images, eq(images.rimId, rims.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId)),
		);
	}

	async getRimsByBrand(reqRinBrand: string) {
		return resultMerger(
			await db
				.select({
					rimId: rims.rimId,
					brand: rims.brand,
					name: rims.rimName,
					nameSuff: rims.rimNameSuffix,
					image: images.miniImg,
					rimConfigs: rimConfigs.configurations,
					price: vendors.price,
				})
				.from(rims)
				.where(ilike(rims.brand, reqRinBrand))
				.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
				.leftJoin(images, eq(images.rimId, rims.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId)),
		);
	}

	async getRimById(reqRimID: number) {
		const result = await resultMerger(
			await db
				.select({
					rimId: rims.rimId,
					brand: rims.brand,
					name: rims.rimName,
					nameSuff: rims.rimNameSuffix,
					images: images.arrImg,
					rimConfigs: rimConfigs.configurations,
					price: vendors.price,
				})
				.from(rims)
				.where(eq(rims.rimId, reqRimID))
				.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
				.leftJoin(images, eq(images.rimId, rims.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId)),
		);

		return result[0];
	}

	async getPopularRims() {
		const result = await resultMerger(
			await db
				.select({
					rimId: rims.rimId,
					brand: rims.brand,
					name: rims.rimName,
					nameSuff: rims.rimNameSuffix,
					rimConfigs: rimConfigs.configurations,
					price: vendors.price,
					image: images.miniImg,
				})
				.from(vendors)
				.where(and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
				.leftJoin(rims, eq(rims.rimId, vendors.rimId))
				.leftJoin(images, eq(images.rimId, vendors.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
				.orderBy(desc(images.quality), desc(vendors.unitsLeft))
				.limit(20),
		);
		return result.slice(0, 8);
	}

	async getRimsByName(name: string) {
		const result = await db
			.select({
				rimId: rims.rimId,
				brand: rims.brand,
				name: rims.rimName,
				nameSuff: rims.rimNameSuffix,
				image: images.miniImg,
				rimConfigs: rimConfigs.configurations,
				price: vendors.price,
			})
			.from(rims)
			.where(or(ilike(rims.brand, `%${name}%`), ilike(rims.rimName, `%${name}%`), ilike(rims.rimNameSuffix, `%${name}%`)))
			.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
			//.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId));
		if (result.length) {
			return resultMerger(result);
		}
		return [];
	}

	async getRimConfigs() {
		const result = await db.select({ rimConfigs: rimConfigs.configurations }).from(rimConfigs);
		return getConfigParams(result);
	}

	async IfRimBrandExist(brand: string) {
		const result = await db.select().from(rims).where(eq(rims.brand, brand));
		if (result.length) {
			return true;
		}
		return false;
	}

	async IfRimExist(id: number) {
		const result = await db.select().from(rims).where(eq(rims.rimId, id));
		if (result.length) {
			return true;
		}
		return false;
	}

	async updateVisits(id: number) {
		let [{ oldPageVisits }] = await db.select({ oldPageVisits: rims.visits }).from(rims).where(eq(rims.rimId, id));
		if (!oldPageVisits) {
			oldPageVisits = 0;
		}
		return await db
			.update(rims)
			.set({ visits: oldPageVisits + 1 })
			.where(eq(rims.rimId, id));
	}

	async allRimsByCar(config: SrchRimByConfCarDTO) {
		const result = await db
			.select({
				rimId: rims.rimId,
				brand: rims.brand,
				name: rims.rimName,
				nameSuff: rims.rimNameSuffix,
				image: images.miniImg,
				rimConfigs: rimConfigs.configurations,
				price: vendors.price,
			})
			.from(vendors)
			.where(and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
			.leftJoin(rims, eq(rims.rimId, vendors.rimId))
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId));

		let rimRespArr: any[] = [];
		result.forEach(dbEl => {
			config.rims.forEach(async reqEl => {
				if (
					(dbEl.rimConfigs?.boltPattern === config.pcd &&
						dbEl.rimConfigs?.diameter === reqEl.diameter &&
						dbEl.rimConfigs.width === reqEl.width) ||
					(dbEl.rimConfigs?.boltPattern === config.pcd &&
						dbEl.rimConfigs?.diameter === reqEl.diameter &&
						dbEl.rimConfigs.width === `${reqEl.width}.0`)
				) {
					let newConfig = dbEl.rimConfigs;
					newConfig.price = priceToUAH(dbEl.price);
					rimRespArr.push({
						rimId: idConvert(dbEl.rimId),
						brand: dbEl.brand,
						name: nameConn(dbEl.name, dbEl.nameSuff),
						image: photoPath(dbEl.image),
						config: [newConfig],
					});
				}
			});
		});
		if (rimRespArr.length) {
			return rimRespArr;
		}
		return [];
	}

	async specificRimsByCar(config: SrchRimByConfCarDTO, brand: string) {
		const result = await db
			.select({
				rimId: rims.rimId,
				brand: rims.brand,
				name: rims.rimName,
				nameSuff: rims.rimNameSuffix,
				image: images.miniImg,
				rimConfigs: rimConfigs.configurations,
				price: vendors.price,
			})
			.from(vendors)
			.where(and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
			.leftJoin(rims, and(eq(rims.rimId, vendors.rimId), eq(rims.brand, brand)))
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId));

		let rimRespArr: any[] = [];
		result.forEach(dbEl => {
			config.rims.forEach(async reqEl => {
				if (
					(dbEl.rimConfigs?.boltPattern === config.pcd &&
						dbEl.rimConfigs?.diameter === reqEl.diameter &&
						dbEl.rimConfigs.width === reqEl.width) ||
					(dbEl.rimConfigs?.boltPattern === config.pcd &&
						dbEl.rimConfigs?.diameter === reqEl.diameter &&
						dbEl.rimConfigs.width === `${reqEl.width}.0`)
				) {
					let newConfig = dbEl.rimConfigs;
					newConfig.price = priceToUAH(dbEl.price);
					rimRespArr.push({
						rimId: idConvert(dbEl.rimId),
						brand: dbEl.brand,
						name: nameConn(dbEl.name, dbEl.nameSuff),
						image: photoPath(dbEl.image),
						config: [newConfig],
					});
				}
			});
		});
		if (rimRespArr.length) {
			return rimRespArr;
		}
		return [];
	}

	async RimsByAllConfig(config: ConfigDTO) {
		return resultMergerConfig(
			await db
				.select({
					rimId: rims.rimId,
					brand: rims.brand,
					name: rims.rimName,
					nameSuff: rims.rimNameSuffix,
					image: images.miniImg,
					rimConfigs: rimConfigs.configurations,
					price: vendors.price,
				})
				.from(vendors)
				.where(and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
				.leftJoin(rims, eq(rims.rimId, vendors.rimId))
				.leftJoin(images, eq(images.rimId, rims.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId)),
			config,
		);
	}
}
export default new Rims();
