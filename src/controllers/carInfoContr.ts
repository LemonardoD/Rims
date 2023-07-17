import { Request, Response } from "express";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import { CarBrandReqDTO, ResCarSearchDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(200, await CarRepo.getAllCarBrands(), res);
	};

	carModels = async (req: CarBrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return this.response(200, await CarRepo.getCarModelsByBrand(brand), res);
	};

	searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => {
		return this.response(200, await RimRepo.RimsByCar(res.locals), res);
	};

	carYears = async (req: any, res: ResCarSearchDTO) => {
		const { brand, model } = req.params;
		return this.response(200, await CarRepo.getCarYearsByModel(brand, model), res);
	};
}

export default new CarInfo();
