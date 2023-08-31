import { eq, ilike, gt, and, or, desc, placeholder } from "drizzle-orm";
import { db } from "../db";
import { images } from "../schemas/imagesSchema";
import { rims } from "../schemas/rimsSchema";
import { rimConfigs } from "../schemas/rimConfigsSchema";
import { vendors } from "../schemas/vendorSchema";

class Rims {
	getAllRims() {
		return db
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
			.orderBy(desc(images.quality), desc(vendors.unitsLeft))
			.prepare("all_rims");
	}

	getRimsByBrand() {
		return db
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
			.where(ilike(rims.brand, placeholder("reqRinBrand")))
			.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.orderBy(desc(images.quality), desc(vendors.unitsLeft))
			.prepare("by_brand_rims");
	}

	getRimById() {
		return db
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
			.where(eq(rims.rimId, placeholder("reqRimID")))
			.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
			.leftJoin(images, eq(images.rimId, rims.rimId))
			.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.prepare("by_id_rim");
	}

	getPopularRims() {
		return db
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
			.limit(15)
			.prepare("by_popular_rims");
	}

	getRimsByName() {
		return (
			db
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
				.where(
					or(
						ilike(rims.brand, placeholder("name")),
						ilike(rims.rimName, placeholder("name")),
						ilike(rims.rimNameSuffix, placeholder("name")),
					),
				)
				.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
				//.leftJoin(vendors, and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0))) if we not show units with zero price
				.leftJoin(images, eq(images.rimId, rims.rimId))
				.leftJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
				.prepare("by_name_rims")
		);
	}

	async ifRimBrandExist(brand: string) {
		return !!(await db.select().from(rims).where(eq(rims.brand, brand))).length;
	}

	async ifRimExist(id: number) {
		return !!(await db.select().from(rims).where(eq(rims.rimId, id))).length;
	}

	async updateRimVisits(reqRimID: number, newVisits: number) {
		return await db.update(rims).set({ visits: newVisits }).where(eq(rims.rimId, reqRimID));
	}
}
export default new Rims();
