import { NextFunction, Response } from "express";
import { RimBrandsReqDto, RimByConfigDto, RimIdReqDto } from "../DTOs/middlewareDTOs";
import { CustomError } from "../helpers/errThrower";
import { Controller } from "../helpers/basicContrClass";
import RimsRepo from "../database/repositories/rimsRepo";

export class RimsInfoMid extends Controller {
	rimsBrandVal = async (req: RimBrandsReqDto, res: Response, next: NextFunction) => {
		const { rimBrand } = req.body;
		if (!(await RimsRepo.IfRimBrandExist(rimBrand)) && rimBrand !== "all") {
			throw new CustomError("We don't have that rims brand.", 406);
		}
		next();
	};

	rimIdVal = async (req: RimIdReqDto, res: Response, next: NextFunction) => {
		const { id } = req.body;
		if (!(await RimsRepo.IfRimsExist(Number(id)))) {
			throw new CustomError("We don't have that rims with that id.", 404);
		}
		next();
	};

	rimConfigVal = async (req: RimByConfigDto, res: Response, next: NextFunction) => {
		const { diameter, width, mountHoles } = req.body;
		if (!diameter || !width || !mountHoles) {
			throw new CustomError("Body with, diameter, width, mountHoles, required!", 406);
		}
		next();
	};
}

export default new RimsInfoMid();
