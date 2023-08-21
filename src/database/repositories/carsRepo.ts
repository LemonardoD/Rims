import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { carBrands } from "../schemas/carBrandsSchema";
import { carModels } from "../schemas/carModelsSchema";
import { SearchByCarDTO, SrchRimByConfCarDTO } from "../../DTOs/dbDTos";

class CarBrands {
	async getAllCarBrands() {
		const brands = await db.select({ carBrand: carBrands.carBrand }).from(carBrands);
		return brands.map(el => el.carBrand);
	}

	async ifCarBrandExist(brand: string) {
		const respDB = await db.select().from(carBrands).where(eq(carBrands.carBrand, brand));
		if (respDB.length) {
			return true;
		}
		return false;
	}

	async ifCarModelExist(brand: string, model: string) {
		const [{ car_model }] = await db
			.select()
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, eq(carModels.carModel, model));
		if (car_model) {
			return true;
		}
		return false;
	}

	async getCarModelsByBrand(brand: string) {
		const result = (
			await db
				.select({
					model: carModels.carModel,
				})
				.from(carModels)
				.where(eq(carModels.carBrandId, carBrands.id))
				.leftJoin(carBrands, eq(carBrands.carBrand, brand))
		).map(el => el.model);
		return result.sort();
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
