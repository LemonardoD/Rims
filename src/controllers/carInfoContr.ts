import { Request, Response } from "express";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import {
	CarBrModYrReqDTO,
	CarBrandAndModelReqDTO,
	CarBrandReqDTO,
	CarNewsReqDTO,
	ResCarSearchDTO,
	SearchByCarReqDTO,
} from "../DTOs/otherDTOs";
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

	carConfig = async (req: CarBrModYrReqDTO, res: ResCarSearchDTO) => {
		const { brand, model } = req.params;
		const year = Number(req.params.year);
		return this.response(200, await CarRepo.carInfoForRim({ brand, model, year }), res);
	};

	searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => {
		if (!req.body.rimBrand || req.body.rimBrand === "all") {
			return this.response(200, await RimRepo.allRimsByCar(res.locals), res);
		}
		return this.response(200, await RimRepo.specificRimsByCar(res.locals, req.body.rimBrand), res);
	};

	carNews = async (req: CarNewsReqDTO, res: ResCarSearchDTO) => {
		const offset = Number(req.params.offset);
		if (!news) {
			return this.response(503, [], res);
		}
		return this.response(200, news.slice(offset, offset + 20), res);
	};
}

export default new CarInfo();
