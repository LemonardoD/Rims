import { and, eq, sql } from "drizzle-orm";
import { database } from "../../../configurations/dbConfiguration";
import { carBrands } from "../schemas/carBrandsSchema";
import { carModels } from "../schemas/carModelsSchema";
import { CarYearsDTO, SearchByCarDTO } from "../../DTOs/dbDTos";
import { rimsSort } from "../../helpers/repoHelpers";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

class CarBrands {
	db;
	constructor(database: NeonHttpDatabase) {
		this.db = database;
	}
	ifCarBrandExist() {
		return this.db
			.select()
			.from(carBrands)
			.where(eq(carBrands.carBrand, sql.placeholder("brands")))
			.prepare("car_brands_exist");
	}

	ifCarBrandModelExist() {
		return this.db
			.select()
			.from(carModels)
			.innerJoin(carBrands, eq(carBrands.carBrand, sql.placeholder("brand")))
			.where(eq(carModels.carModel, sql.placeholder("model")))
			.prepare("car_brand_model_exist");
	}

	async ifCarBrandModelYearExist(brand: string, model: string, year: string) {
		const result = await this.db
			.select()
			.from(carModels)
			.innerJoin(carBrands, eq(carBrands.id, carModels.carBrandId))
			.where(
				and(
					eq(carModels.carModel, model),
					sql`(${carModels.modelInfo} -> 'years' ) @> '[{"value": ${sql.raw(year)}}]'`,
					eq(carBrands.carBrand, brand)
				)
			);
		return !!result.length;
	}

	allCarBrands() {
		return this.db.select({ brand: carBrands.carBrand }).from(carBrands).prepare("car_brands");
	}

	carModelsByBrand() {
		return this.db
			.select({
				model: carModels.carModel,
			})
			.from(carModels)
			.where(eq(carModels.carBrandId, carBrands.id))
			.groupBy(carModels.carModel)
			.innerJoin(carBrands, eq(carBrands.carBrand, sql.placeholder("brand")))
			.prepare("car_models");
	}

	async carYearsByModel(model: string) {
		const [{ years }] = await this.db
			.select({
				years: sql<CarYearsDTO[]>`${carModels.modelInfo} -> 'years'`,
			})
			.from(carModels)
			.where(eq(carModels.carModel, model));
		return years.map(el => el.value);
	}

	async carRimConfig(info: SearchByCarDTO) {
		const { model, year } = info;
		const [{ modelConfig }] = await this.db
			.select({
				modelConfig: sql<CarYearsDTO>`${carModels.modelInfo} -> 'years' -> 1`,
			})
			.from(carModels)
			.where(and(sql`(${carModels.modelInfo} -> 'years') @> '[{"value": ${sql.raw(year)}}]'`, eq(carModels.carModel, model)));
		const [{ pcd, rims }] = modelConfig.configs;
		return {
			pcd,
			rims: rims.sort(rimsSort),
		};
	}
}
export default new CarBrands(database);
