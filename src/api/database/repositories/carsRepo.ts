import { eq, placeholder, sql } from "drizzle-orm";
import { db } from "../../../configurations/dbConfiguration";
import { carBrands } from "../schemas/carBrandsSchema";
import { carModels } from "../schemas/carModelsSchema";
import { CarYearsDTO, SearchByCarDTO, CarConfigsDTO } from "../../DTOs/dbDTos";

class CarBrands {
	getAllCarBrands() {
		return db.select({ brand: carBrands.carBrand }).from(carBrands).prepare("car_brands");
	}

	ifCarBrandExist() {
		return db
			.select({ countBrand: sql<string>`count(*)` })
			.from(carBrands)
			.where(eq(carBrands.carBrand, placeholder("brands")))
			.prepare("car_brands_exist");
	}

	ifCarModelExist() {
		return db
			.select({ countModel: sql<string>`count(*)` })
			.from(carModels)
			.where(eq(carModels.carModel, placeholder("model")))
			.prepare("car_model_exist");
	}

	getCarModelsByBrand() {
		return db
			.select({
				model: carModels.carModel,
			})
			.from(carModels)
			.where(eq(carModels.carBrandId, carBrands.id))
			.groupBy(carModels.carModel)
			.leftJoin(carBrands, eq(carBrands.carBrand, placeholder("brand")))
			.prepare("car_models");
	}

	async getCarYearsByModel(model: string) {
		const [{ modelInfo }] = await db
			.select({
				modelInfo: sql<CarYearsDTO[]>`${carModels.modelInfo} -> 'years'`,
			})
			.from(carModels)
			.where(eq(carModels.carModel, model));
		return modelInfo.map(el => el.value);
	}

	// async ifCarYearExist(model: string, year: number) { // if exist or check input year on arr of years
	// 	const { rows } = await db.execute(sql`SELECT item_object->'configs' AS CONFIG FROM(SELECT arr.item_object
	// 		FROM ${carModels}, jsonb_array_elements(${carModels.modelInfo} -> 'years') with ordinality arr(item_object)
	// 		WHERE ${carModels.carModel}=${model}) AS years WHERE  item_object->'value' = ${year}`);
	// 	return !rows[0].config.length;
	// }

	// async getCarRimConfig(info: SearchByCarDTO) {   // how be better?
	// 	const { model, year } = info;
	// 	const { rows } = await db.execute(sql`SELECT item_object->'configs' AS CONFIG FROM(SELECT arr.item_object
	// 		FROM ${carModels},
	// 		jsonb_array_elements(${carModels.modelInfo} -> 'years') with ordinality arr(item_object)
	// 		WHERE ${carModels.carModel}=${model}) AS years WHERE  item_object->'value' = ${year}`)!;
	// 	const [{ config }] = rows as { config: CarConfigsDTO[] }[];
	// 	const { pcd, rims } = config[0];
	// 	return { pcd, rims };
	// }
	async getCarRimConfig(info: SearchByCarDTO): Promise<CarConfigsDTO> {
		const { model, year } = info;
		const [{ modelInfo }] = await db
			.select({
				modelInfo: sql<CarYearsDTO[]>`${carModels.modelInfo} -> 'years'`,
			})
			.from(carModels)
			.where(eq(carModels.carModel, model));
		let respArr: [CarConfigsDTO][] = [];
		modelInfo.forEach(el => {
			if (el.value === year) respArr.push(el.configs);
		});
		const [[{ pcd, rims }]] = respArr;
		return { pcd, rims };
	}
}
export default new CarBrands();
