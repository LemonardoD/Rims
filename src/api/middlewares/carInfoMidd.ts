import Handler from "../helpers/handler";
import CarRepo from "../database/repositories/carsRepo";
import RimsRepo from "../database/repositories/rimsRepo";
import { NextFunction, Response } from "express";
import { CarBrModYrReqDTO, CarBrandAndModelReqDTO, BrandReqDTO, SearchByCarReqDTO } from "../types/otherDto";

class CarInfoMid {
	carBrandVal = async (req: BrandReqDTO, res: Response, next: NextFunction) => {
		const { brand } = req.params;
		if (!(await CarRepo.ifCarBrandExist().execute({ brands: brand })).length) {
			Handler.throwError("We do not have that car brand.", 400);
		}
		return next();
	};

	carBrandAndModelVal = async (req: CarBrandAndModelReqDTO, res: Response, next: NextFunction) => {
		const { brand, model } = req.params;
		if (!(await CarRepo.ifCarBrandModelExist().execute({ model: model, brand: brand })).length) {
			Handler.throwError(`We do not have car brand ${brand} or model of that brand.`, 404);
		}
		return next();
	};

	carBrModYrVal = async (req: CarBrModYrReqDTO, res: Response, next: NextFunction) => {
		const { brand, model, year } = req.params;
		if (!(await CarRepo.ifCarBrandModelYearExist(brand, model, year))) {
			Handler.throwError(`We do not have car brand ${brand} or model of that brand or model with such year.`, 404);
		}
		return next();
	};

	rimByCarVal = async (req: SearchByCarReqDTO, res: Response, next: NextFunction) => {
		const { brand, model, year, rimBrand } = req.body;
		if (!brand || !model || !year || typeof year === "string") {
			Handler.throwError("Body with, brand: string, model: string, year: number,  required ", 400);
		}
		if (!rimBrand && rimBrand !== "all" && !(await RimsRepo.ifRimBrandExist().execute({ brand: brand })).length) {
			Handler.throwError("rimBrand required, it has been typed in incorrectly or we do not have that brand yet.", 400);
		}
		const requestedConfig = await CarRepo.carRimConfig({ brand, model, year: year.toString() });
		if (requestedConfig) {
			res.locals = requestedConfig;
			return next();
		}
		Handler.throwError("We do not have car with that info in db", 404);
	};
}

export default new CarInfoMid();
