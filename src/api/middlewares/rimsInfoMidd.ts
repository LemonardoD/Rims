import { NextFunction, Response } from "express";
import { RimBrandsReqDTO, RimByConfigDTO, RimIdReqDTO, SearchReqDTO } from "../DTOs/otherDTOs";
import { CustomError } from "../helpers/errorClass";
import { Controller } from "../helpers/basicContrClass";
import RimsRepo from "../database/repositories/rimsRepo";

export class RimsInfoMid extends Controller {
	rimsBrandVal = async (req: RimBrandsReqDTO, res: Response, next: NextFunction) => {
		const { rimBrand } = req.body;
		if (!(await RimsRepo.ifRimBrandExist(rimBrand)) && rimBrand !== "all") {
			throw new CustomError("We don't have that rims brand.", 406);
		}
		next();
	};

	rimIdVal = async (req: RimIdReqDTO, res: Response, next: NextFunction) => {
		const id = Number(req.body.id);
		if (!(await RimsRepo.ifRimExist(id))) {
			throw new CustomError("We don't have that rims with that id.", 404);
		}
		next();
	};

	rimNameVal = async (req: SearchReqDTO, res: Response, next: NextFunction) => {
		const { searchText } = req.body;
		if (!searchText) throw new CustomError("SearchText, required!", 406);
		next();
	};

	rimConfigVal = async (req: RimByConfigDTO, res: Response, next: NextFunction) => {
		const { mountingHoles, width, diameter } = req.body;
		if (!mountingHoles || !width || !diameter) {
			throw new CustomError("Body with, diameter,  width and mountingHoles, required!", 406);
		}
		next();
	};
}

export default new RimsInfoMid();