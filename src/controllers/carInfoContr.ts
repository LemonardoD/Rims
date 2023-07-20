import { Request, Response } from "express";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import { CarBrandAndModelReqDTO, CarBrandReqDTO, CarNewsReqDTO, ResCarSearchDTO } from "../DTOs/otherDTOs";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";
import { news } from "../services/feed";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(200, await CarRepo.getAllCarBrands(), res);
	};

	carModels = async (req: CarBrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return this.response(200, await CarRepo.getCarModelsByBrand(brand), res);
	};

	carYears = async (req: CarBrandAndModelReqDTO, res: ResCarSearchDTO) => {
		const { brand, model } = req.params;
		return this.response(200, await CarRepo.getCarYearsByModel(brand, model), res);
	};

	searchRimsByCar = async (req: Request, res: ResCarSearchDTO) => {
		return this.response(200, await RimRepo.RimsByCar(res.locals), res);
	};

	carNews = async (req: CarNewsReqDTO, res: ResCarSearchDTO) => {
		const offset = Number(req.params.offset);
		return this.response(200, news.slice(offset, offset + 20), res);
	};
}

export default new CarInfo();
