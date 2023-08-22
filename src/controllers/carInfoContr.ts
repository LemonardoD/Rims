import { Request, Response } from "express";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";
import { news } from "../services/feed";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import {
	CarBrModYrReqDTO,
	CarBrandAndModelReqDTO,
	CarBrandReqDTO,
	CarNewsReqDTO,
	ResCarSearchDTO,
	SearchByCarReqDTO,
} from "../DTOs/otherDTOs";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(200, await CarRepo.getAllCarBrands(), res);
	};

	carModels = async (req: CarBrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return this.response(200, await CarRepo.getCarModelsByBrand(brand), res);
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
		return this.response(200, await RimRepo.rimsByCar(res.locals, rimBrand), res);
	};

	carNews = (req: CarNewsReqDTO, res: ResCarSearchDTO) => {
		const offset = Number(req.params.page) * 20;
		if (!news) {
			return this.response(503, [], res);
		}
		return this.response(200, news.slice(offset - 20, offset), res);
	};
}

export default new CarInfo();
