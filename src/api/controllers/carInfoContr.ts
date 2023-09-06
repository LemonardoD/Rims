import { Request, Response } from "express";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import { CarBrModYrReqDTO, CarBrandAndModelReqDTO, CarBrandReqDTO, ResCarSearchDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import { rimByCarProcessor } from "../helpers/DBRespProcessors/rimByCarProcessor";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(
			200,
			(await CarRepo.getAllCarBrands().execute()).map(el => el.brand),
			res,
		);
	};

	carModels = async (req: CarBrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return this.response(
			200,
			(await CarRepo.getCarModelsByBrand().execute({ brand: brand })).map(el => el.model),
			res,
		);
	};

	carYears = async (req: CarBrandAndModelReqDTO, res: ResCarSearchDTO) => {
		const { model } = req.params;
		return this.response(200, await CarRepo.getCarYearsByModel(model), res);
	};

	carConfig = async (req: CarBrModYrReqDTO, res: ResCarSearchDTO) => {
		const { brand, model } = req.params;
		const year = Number(req.params.year);
		return this.response(200, await CarRepo.getCarRimConfig({ brand, model, year }), res);
	};

	searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => {
		const { rimBrand } = req.body;
		if (rimBrand === "all") {
			const rims = await RimRepo.getAllRims().execute();
			return this.response(200, rimByCarProcessor(rims, res.locals), res);
		}
		const rims = await RimRepo.getRimsByBrand().execute({ brand: rimBrand });
		return this.response(200, rimByCarProcessor(rims, res.locals), res);
	};
}

export default new CarInfo();
