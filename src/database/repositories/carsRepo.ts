import { eq, and, placeholder } from "drizzle-orm";
import { db } from "../db";
import { carBrands } from "../schemas/carBrandsSchema";
import { carModels } from "../schemas/carModelsSchema";
import { SearchByCarDTO, SrchRimByConfCarDTO } from "../../DTOs/dbDTos";

class CarBrands {
	getAllCarBrands() {
		return db.select({ brand: carBrands.carBrand }).from(carBrands).prepare("car_brands");
	}

	async ifCarBrandExist(brand: string) {
		return !!(await db.select().from(carBrands).where(eq(carBrands.carBrand, brand))).length;
	}
	async ifCarModelExist(brand: string, model: string) {
		return !!(await db
			.select()
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, eq(carModels.carModel, model)));
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
				modelInfo: carModels.modelInfo,
			})
			.from(carModels)
			.where(eq(carModels.carModel, model));
		return modelInfo.years.map(el => el.value);
	}

	async getCarRimConfig(info: SearchByCarDTO): Promise<SrchRimByConfCarDTO> {
		const { brand, model, year } = info;
		const [{ modelInfo }] = await db
			.select({
				modelInfo: carModels.modelInfo,
			})
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, and(eq(carModels.carBrandId, carBrands.id), eq(carModels.carModel, model)));
		let respArr: [SrchRimByConfCarDTO][] = [];
		if (modelInfo) {
			modelInfo?.years.forEach(el => {
				if (el.value === year) respArr.push(el.configs);
			});
		}
		const [[{ pcd, rims }]] = respArr;
		return { pcd, rims };
	}
}
export default new CarBrands();
