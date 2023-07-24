import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { rimConfig } from "../schemas/rimConfigSchema";
import { resultMerger } from "../../helpers/repoHelpers";
import { tableRims } from "../schemas/rimsSchema";
import { RimsMainSortedBrandDTO, SearchRimByConfDTO } from "../../DTOs/dbDTos";

class RimByConfig {
	async RimsByAllConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			return resultMerger(rims);
		}
		return null;
	}

	async RimsByMHWConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			.leftJoin(rimConfig, and(eq(rimConfig.mountingHoles, config.mountHoles), eq(rimConfig.rimWidth, config.width)));
		if (rims.length) {
			return resultMerger(rims);
		}
		return null;
	}

	async RimsByWDConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			.leftJoin(rimConfig, and(eq(rimConfig.rimWidth, config.width), eq(rimConfig.rimDiameter, config.diameter)));
		if (rims.length) {
			return resultMerger(rims);
		}
		return null;
	}

	async RimsByMHDConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			.leftJoin(rimConfig, and(eq(rimConfig.mountingHoles, config.mountHoles), eq(rimConfig.rimDiameter, config.diameter)));
		if (rims.length) {
			return resultMerger(rims);
		}
		return null;
	}

	async RimsByWidthConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			.leftJoin(rimConfig, eq(rimConfig.rimWidth, config.width));
		if (rims.length) {
			return resultMerger(rims);
		}
		return null;
	}

	async RimsByDiameterConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			.leftJoin(rimConfig, eq(rimConfig.rimDiameter, config.diameter));
		if (rims.length) {
			return resultMerger(rims);
		}
		return null;
	}

	async RimsByMHConfig(config: SearchRimByConfDTO): Promise<RimsMainSortedBrandDTO[] | null> {
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
			.leftJoin(rimConfig, eq(rimConfig.mountingHoles, config.mountHoles));
		if (rims.length) {
			return resultMerger(rims);
		}
		return null;
	}
}

export default new RimByConfig();
