import { Request, Response } from "express";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import { CarBrandReqDTO, ResCarSearchDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(200, await CarRepo.getAllCarBrands(), res);
	};

	carModelsAndYears = async (req: CarBrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return this.response(200, await CarRepo.getCarModelsByBrand(brand), res);
	};

	searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => {
		return this.response(200, await RimRepo.RimsByCar(res.locals), res);
	};
}

export default new CarInfo();
