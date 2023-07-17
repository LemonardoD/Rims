import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { carBrands } from "../schemas/carBrandsSchema";
import { carModels } from "../schemas/carModelsSchema";
import { RimConfigInfoDTO, SearchByCarDTO, SrchRimByConfCarDTO } from "../../DTOs/dbDTos";

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

	async IfCarModelExist(model: string) {
		const result = await db.select().from(carModels).where(eq(carModels.carModel, model));
		if (result.length) {
			return true;
		}
		return false;
	}

	async getCarModelsByBrand(brand: string): Promise<(string | null)[]> {
		const result = await db
			.select({
				model: carModels.carModel,
			})
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, eq(carModels.carBrandId, carBrands.id));
		return result.map(el => el.model);
	}

	async getCarYearsByModel(brand: string, model: string) {
		const [{ modelInfo }] = await db
			.select({
				modelInfo: carModels.modelInfo,
			})
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, and(eq(carModels.carBrandId, carBrands.id), eq(carModels.carModel, model)));
		const response = modelInfo?.years?.map(el => el.value);
		if (response === undefined) {
			return null;
		}
		return response;
	}

	async carInfoForRim(info: SearchByCarDTO): Promise<SrchRimByConfCarDTO> {
		const { brand, model, year } = info;
		const [{ modelInfo }] = await db
			.select({
				modelInfo: carModels.modelInfo,
			})
			.from(carBrands)
			.where(eq(carBrands.carBrand, brand))
			.leftJoin(carModels, and(eq(carModels.carBrandId, carBrands.id), eq(carModels.carModel, model)));
		let respArr: [RimConfigInfoDTO][] = [];
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
