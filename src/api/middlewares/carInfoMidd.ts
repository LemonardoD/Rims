import { NextFunction, Response } from "express";
import { CarBrModYrReqDTO, CarBrandAndModelReqDTO, CarBrandReqDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import { CustomError } from "../helpers/errorClass";
import { Controller } from "../helpers/basicContrClass";
import CarRepo from "../database/repositories/carsRepo";
import RimsRepo from "../database/repositories/rimsRepo";

export class CarInfoMid extends Controller {
	carBrandVal = async (req: CarBrandReqDTO, res: Response, next: NextFunction) => {
		const { brand } = req.params;

		const [{ countBrand }] = await CarRepo.ifCarBrandExist().execute({ brands: brand });
		if (!+countBrand) throw new CustomError("We do not have that car brand.", 406);

		next();
	};

	carBrandAndModelVal = async (req: CarBrandAndModelReqDTO, res: Response, next: NextFunction) => {
		const { brand, model } = req.params;

		const [{ countBrand }] = await CarRepo.ifCarBrandExist().execute({ brands: brand });
		if (!+countBrand) throw new CustomError("We do not have that car brand.", 406);

		const [{ countModel }] = await CarRepo.ifCarModelExist().execute({ model: model });
		if (!+countModel) throw new CustomError(`We do not have model of the ${brand} brand.`, 404);

		next();
	};

	carBrModYrVal = async (req: CarBrModYrReqDTO, res: Response, next: NextFunction) => {
		const { brand, model } = req.params;
		const year = Number(req.params.year);

		const [{ countBrand }] = await CarRepo.ifCarBrandExist().execute({ brands: brand });
		if (!+countBrand) throw new CustomError("We do not have that car brand.", 406);

		const [{ countModel }] = await CarRepo.ifCarModelExist().execute({ model: model });
		if (!+countModel) throw new CustomError(`We do not have model of the ${brand} brand.`, 404);

		const years = await CarRepo.getCarYearsByModel(model);
		// if (await CarRepo.ifCarYearExist(model, year)) {
		// 	throw new CustomError(`We do not have model of the ${brand} brand with such year.`, 404);
		// }
		if (!years.includes(year)) {
			throw new CustomError(`We do not have model of the ${brand} brand with such year.`, 404);
		}
		next();
	};

	rimByCarVal = async (req: SearchByCarReqDTO, res: Response, next: NextFunction) => {
		const { brand, model, year, rimBrand } = req.body;
		if (!brand || !model || !year || typeof year === "string") {
			throw new CustomError("Body with, brand: string, model: string, year: number,  required ", 406);
		}
		if (!rimBrand) throw new CustomError(`rimBrand required, type in  name of the brand, or set "all"`, 406);

		if (rimBrand !== "all" && !(await RimsRepo.ifRimBrandExist(rimBrand))) {
			throw new CustomError("rimBrand name typed in incorrectly or we do not have that brand yet.", 406);
		}
		const requestedConfig = await CarRepo.getCarRimConfig(req.body);
		if (requestedConfig) {
			const { pcd, rims } = requestedConfig;
			res.locals = { pcd, rims };
			return next();
		}
		throw new CustomError("We do not have car with that info in db", 404);
	};
}

export default new CarInfoMid();
