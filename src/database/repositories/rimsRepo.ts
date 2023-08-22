import { eq, ilike, gt, and, or, desc } from "drizzle-orm";
import { db } from "../db";
import { images } from "../schemas/imagesSchema";
import { resultMerger, resultMergerConfig, rimByCarMerger } from "../../helpers/repoHelpers";
import { rims } from "../schemas/rimsSchema";
import { rimConfigs } from "../schemas/rimConfigsSchema";
import { vendors } from "../schemas/vendorSchema";
import { ConfigDTO } from "../../DTOs/otherDTOs";
import { SrchRimByConfCarDTO } from "../../DTOs/dbDTos";

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
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
				.orderBy(desc(images.quality), desc(vendors.unitsLeft)),
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
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
				.orderBy(desc(images.quality), desc(vendors.unitsLeft)),
		);
	}

	async getRimById(reqRimID: number) {
		const result = await db
			.select({
				rimId: rims.rimId,
				brand: rims.brand,
				name: rims.rimName,
				nameSuff: rims.rimNameSuffix,
				oldPageVisits: rims.visits,
				images: images.arrImg,
				rimConfigs: rimConfigs.configurations,
				price: vendors.price,
			})
			.from(rims)
			.where(eq(rims.rimId, reqRimID))
			.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId));
		const [{ oldPageVisits, rimId }] = result;
		await db
			.update(rims)
			.set({ visits: oldPageVisits + 1 })
			.where(eq(rims.rimId, rimId));
		const [mergedResult] = resultMerger(result);
		return mergedResult;
	}

	async getPopularRims() {
		const result = await db
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
			.limit(20);
		return resultMerger(result).slice(0, 8);
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
			//.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0))) if we not show units with zero price
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId));
		return resultMerger(result);
	}

	// async getRimConfigs() {
	// 	const result = await db.select({ rimConfigs: rimConfigs.configurations }).from(rimConfigs);
	// 	return getConfigParams(result);
	// }

	async ifRimBrandExist(brand: string) {
		const result = await db.select().from(rims).where(eq(rims.brand, brand));
		if (result.length) {
			return true;
		}
		return false;
	}

	async ifRimExist(id: number) {
		const result = await db.select().from(rims).where(eq(rims.rimId, id));
		if (result.length) {
			return true;
		}
		return false;
	}

	async rimsByCar(config: SrchRimByConfCarDTO, brand: string) {
		if (brand === "all") {
			return rimByCarMerger(
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
					.leftJoin(rims, and(eq(rims.rimId, vendors.rimId)))
					.leftJoin(images, eq(images.rimId, rims.rimId))
					.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId)),
				config,
			);
		}
		return rimByCarMerger(
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
				.leftJoin(rims, and(eq(rims.rimId, vendors.rimId), eq(rims.brand, brand)))
				.leftJoin(images, eq(images.rimId, rims.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId)),
			config,
		);
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
	//async getById(id: number) {
	// 	const [response] = await resultMerger(
	// 		await db.transaction(async tx => {
	// 			const rimInfo = await tx
	// 				.select({
	// 					rimId: rims.rimId,
	// 					brand: rims.brand,
	// 					name: rims.rimName,
	// 					nameSuff: rims.rimNameSuffix,
	// 					images: images.arrImg,
	// 					rimConfigs: rimConfigs.configurations,
	// 					price: vendors.price,
	// 					oldPageVisits: rims.visits,
	// 				})
	// 				.from(rims)
	// 				.where(eq(rims.rimId, id))
	// 				.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
	// 				.leftJoin(images, eq(images.rimId, rims.rimId))
	// 				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId));
	// 			await tx
	// 				.update(rims)
	// 				.set({ visits: rimInfo[0].oldPageVisits + 1 })
	// 				.where(eq(rims.rimId, id));
	// 			return rimInfo;
	// 		}),
	// 	);
	// 	return response;
	// }
}
export default new Rims();
