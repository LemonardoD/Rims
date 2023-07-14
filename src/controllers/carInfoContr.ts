import { Request, Response } from "express";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import { CarBrandReqDto, ResCarSearchDto, SearchByCarReqDto } from "../DTOs/middlewareDTOs";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(200, await CarRepo.getAllCarBrands(), res);
	};

	carModelsAndYears = async (req: CarBrandReqDto, res: Response) => {
		const { brand } = req.params;
		return this.response(200, await CarRepo.getCarModelByBrands(brand), res);
	};

	searchByCar = async (req: SearchByCarReqDto, res: ResCarSearchDto) => {
		return this.response(200, await RimRepo.RimsByCar(res.locals), res);
	};
}

export default new CarInfo();
