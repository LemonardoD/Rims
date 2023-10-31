import { eq, ilike, gt, and, or, desc, sql } from "drizzle-orm";
import { database } from "../../../configurations/dbConfiguration";
import { images } from "../schemas/imagesSchema";
import { rims } from "../schemas/rimsSchema";
import { rimConfigs } from "../schemas/rimConfigsSchema";
import { vendors } from "../schemas/vendorSchema";
import { PrepQuer, PrepByIdQuer } from "../../DTOs/dbDTos";
import { ConfigDTO } from "../../DTOs/otherDTOs";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

class Rims {
	db;
	constructor(database: NeonHttpDatabase) {
		this.db = database;
	}
	allRims(): PrepQuer {
		return this.db
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
			.innerJoin(rims, eq(rims.rimId, vendors.rimId))
			.innerJoin(images, eq(images.rimId, rims.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.orderBy(desc(images.quality), desc(vendors.unitsLeft))
			.prepare("all_rims");
	}

	rimsByConfig(rimInfo: ConfigDTO): PrepQuer {
		const { diameter, width, mountingHoles } = rimInfo;
		return this.db
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
			.where(
				sql`${rimConfigs.configurations}  @> '{"diameter": "${sql.raw(diameter)}"}' and
				(${rimConfigs.configurations}  @> '{"width": "${sql.raw(width)}.0"}' or
				${rimConfigs.configurations}  @> '{"width": "${sql.raw(width)}"}') and
				${rimConfigs.configurations}  @> '{"boltPattern": "${sql.raw(mountingHoles)}"}' and
				${vendors.rimId} = ${rims.rimId} and
				${vendors.unitsLeft} > 0 `,
			)
			.innerJoin(rims, eq(rims.rimId, vendors.rimId))
			.innerJoin(images, eq(images.rimId, rims.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.prepare("by_config_rims");
	}

	rimsByPCD(mountingHoles: string, brand: string): PrepQuer {
		return this.db
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
			.where(
				brand === "all"
					? sql`${rimConfigs.configurations}  @> '{"boltPattern": "${sql.raw(mountingHoles)}"}' and
					${vendors.rimId} = ${rims.rimId} and 
					${vendors.unitsLeft} > 0`
					: sql`${rimConfigs.configurations}  @> '{"boltPattern": "${sql.raw(mountingHoles)}"}' and
					${vendors.rimId} = ${rims.rimId} and 
					${vendors.unitsLeft} > 0 and
					${rims.brand} = ${brand}`,
			)
			.innerJoin(rims, eq(rims.rimId, vendors.rimId))
			.innerJoin(images, eq(images.rimId, rims.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.prepare("by_pcd_rims");
	}

	rimsByBrand(): PrepQuer {
		return this.db
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
			.where(ilike(rims.brand, sql.placeholder("reqRimBrand")))
			.innerJoin(vendors, and(eq(vendors.rimId, rims.rimId), gt(vendors.unitsLeft, 0)))
			.innerJoin(images, eq(images.rimId, rims.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.orderBy(desc(images.quality), desc(vendors.unitsLeft))
			.prepare("by_brand_rims");
	}

	rimById(): PrepByIdQuer {
		return this.db
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
			.where(eq(rims.rimId, sql.placeholder("reqRimID")))
			.innerJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
			.innerJoin(images, eq(images.rimId, rims.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.prepare("by_id_rim");
	}

	popularRims(): PrepQuer {
		return this.db
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
			.innerJoin(rims, eq(rims.rimId, vendors.rimId))
			.innerJoin(images, eq(images.rimId, vendors.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.groupBy(rims.rimId, rimConfigs.configId, images.miniImg, vendors.price, images.quality)
			.orderBy(desc(images.quality), desc(sql`sum(${vendors.unitsLeft})`))
			.limit(24)
			.prepare("popular_rims");
	}

	rimsByName(): PrepQuer {
		return this.db
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
					ilike(rims.brand, sql.placeholder("name")),
					ilike(rims.rimName, sql.placeholder("name")),
					ilike(rims.rimNameSuffix, sql.placeholder("name")),
				),
			)
			.innerJoin(vendors, and(eq(vendors.rimId, rims.rimId)))
			.innerJoin(images, eq(images.rimId, rims.rimId))
			.innerJoin(rimConfigs, eq(rimConfigs.configId, vendors.rimConfigId))
			.prepare("by_name_rims");
	}

	ifRimBrandExist() {
		return this.db
			.select()
			.from(rims)
			.where(eq(rims.brand, sql.placeholder("brand")))
			.prepare("brand_exist");
	}

	ifRimExist() {
		return this.db
			.select()
			.from(rims)
			.where(eq(rims.rimId, sql.placeholder("rimId")))
			.prepare("rim_exist");
	}

	updateRimVisits() {
		return this.db
			.update(rims)
			.set({ visits: sql`${rims.visits} + 1` })
			.where(eq(rims.rimId, sql.placeholder("reqRimID")))
			.prepare("update_visits");
	}
}
export default new Rims(database);
