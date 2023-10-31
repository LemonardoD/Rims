import { Request, Response } from "express";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";
import { CarBrModYrReqDTO, CarBrandAndModelReqDTO, BrandReqDTO, ResCarSearchDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import { rimByCarProcessor } from "../helpers/DBRespProcessors/rimByCarProcessor";
import Handler from "../helpers/handler";

class CarInfo {
	allCarBrands = async (req: Request, res: Response) => {
		return Handler.response(
			200,
			(await CarRepo.allCarBrands().execute()).map(el => el.brand),
			res,
		);
	};

	carModels = async (req: BrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return Handler.response(
			200,
			(await CarRepo.carModelsByBrand().execute({ brand: brand })).map(el => el.model),
			res,
		);
	};

	carYears = async (req: CarBrandAndModelReqDTO, res: ResCarSearchDTO) => {
		const { model } = req.params;
		return Handler.response(200, await CarRepo.carYearsByModel(model), res);
	};

	carConfig = async (req: CarBrModYrReqDTO, res: ResCarSearchDTO) => {
		const { brand, model, year } = req.params;
		return Handler.response(200, await CarRepo.carRimConfig({ brand, model, year }), res);
	};

	searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => {
		const { rimBrand } = req.body;
		const rims = await RimRepo.rimsByPCD(res.locals.pcd, rimBrand).execute();
		return Handler.response(200, rimByCarProcessor(rims, res.locals), res);
	};
}

export default new CarInfo();
