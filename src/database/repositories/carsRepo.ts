import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { carBrands } from "../schemas/carBrandsSchema";
import { carModels } from "../schemas/carModelsSchema";
import { ModelYear, RimConfig, SearchByCarDto, SrchRimByConfCarDto } from "../../DTOs/dbDTos";

class CarBrands {
	async getAllCarBrands() {
		const brands = await db.select({ carBrand: carBrands.carBrand }).from(carBrands);
		let finalBrandArr: string[] = [];
		brands.forEach(element => finalBrandArr.push(element.carBrand));
		return finalBrandArr;
	}

	async IfCarBrandExist(brand: string) {
		const result = await db.select().from(carBrands).where(eq(carBrands.carBrand, brand));
		if (result.length) {
			return true;
		}
		return false;
	}

	async getCarModelsByBrand(brand: string): Promise<ModelYear[]> {
		const result = await db
			.select({
				model: carModels.carModel,
				modelInfo: carModels.modelInfo,
			})
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, eq(carModels.carBrandId, carBrands.id));
		let finalArr = [];
		for (let i = 0; i < result.length; i++) {
			finalArr.push({ model: result[i].model, years: result[i].modelInfo?.years?.map(el => el.value) });
		}
		return finalArr;
	}

	async carInfoForRim(info: SearchByCarDto): Promise<SrchRimByConfCarDto> {
		const { brand, model, year } = info;
		const [{ modelInfo }] = await db
			.select({
				modelInfo: carModels.modelInfo,
			})
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, and(eq(carModels.carBrandId, carBrands.id), eq(carModels.carModel, model)));
		let respArr: [RimConfig][] = [];
		if (modelInfo) {
			modelInfo?.years?.forEach(el => {
				if (el.value === year) respArr.push(el.configs);
			});
		}
		const [[{ pcd, rims }]] = respArr;
		return { pcd, rims };
	}
}
export default new CarBrands();
