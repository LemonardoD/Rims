import { NextFunction, Response } from "express";
import { CarBrandReqDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
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
