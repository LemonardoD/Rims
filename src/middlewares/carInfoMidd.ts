import { NextFunction, Response } from "express";
import { CarBrModYrReqDTO, CarBrandAndModelReqDTO, CarBrandReqDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import { CustomError } from "../helpers/errThrower";
import { Controller } from "../helpers/basicContrClass";
import CarRepo from "../database/repositories/carsRepo";

export class CarInfoMid extends Controller {
	carBrandVal = async (req: CarBrandReqDTO, res: Response, next: NextFunction) => {
		const { brand } = req.params;
		if (!(await CarRepo.IfCarBrandExist(brand))) {
			throw new CustomError("We don't have that car brand.", 406);
		}
		next();
	};

	carBrandAndModelVal = async (req: CarBrandAndModelReqDTO, res: Response, next: NextFunction) => {
		const { brand, model } = req.params;
		if (!(await CarRepo.IfCarBrandExist(brand))) {
			throw new CustomError("We don't have that car brand.", 406);
		}
		if (!(await CarRepo.IfCarModelExist(model))) {
			throw new CustomError(`We don't have model of the ${brand} brand.`, 406);
		}
		next();
	};

	carBrModYrVal = async (req: CarBrModYrReqDTO, res: Response, next: NextFunction) => {
		const { brand, model } = req.params;
		const year = Number(req.params.year);
		if (!(await CarRepo.IfCarBrandExist(brand))) {
			throw new CustomError("We don't have that car brand.", 404);
		}
		if (!(await CarRepo.IfCarModelExist(model))) {
			throw new CustomError(`We don't have model of the ${brand} brand.`, 404);
		}
		const years = await CarRepo.getCarYearsByModel(brand, model);
		if (!years?.includes(year)) {
			throw new CustomError(`We don't have model of the ${brand} brand don't have such year.`, 404);
		}
		next();
	};

	rimByCarVal = async (req: SearchByCarReqDTO, res: Response, next: NextFunction) => {
		const { brand, model, year } = req.body;
		if (!brand || !model || !year) {
			throw new CustomError("Body with, brand, model, year,  required ", 406);
		}
		const requestedConfig = await CarRepo.carInfoForRim(req.body);
		if (requestedConfig) {
			const { pcd, rims } = requestedConfig;
			res.locals = { pcd, rims };
			return next();
		}
		throw new CustomError("We don't have car with that info in db", 404);
	};
}

export default new CarInfoMid();
