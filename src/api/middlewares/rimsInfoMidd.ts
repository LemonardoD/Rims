import { NextFunction, Response } from "express";
import { BrandReqDTO, RimByConfigDTO, RimIdReqDTO, SearchReqDTO } from "../DTOs/otherDTOs";
import Handler from "../helpers/handler";
import RimsRepo from "../database/repositories/rimsRepo";

class RimsInfoMid {
	rimsBrandVal = async (req: BrandReqDTO, res: Response, next: NextFunction) => {
		const { brand } = req.params;
		if (brand !== "all" && !(await RimsRepo.ifRimBrandExist().execute({ brand: brand })).length) {
			Handler.throwError("We do not have that rims brand.", 404);
		}
		return next();
	};

	rimIdVal = async (req: RimIdReqDTO, res: Response, next: NextFunction) => {
		const id = Number(req.params.id);
		if (!(await RimsRepo.ifRimExist().execute({ rimId: id })).length) {
			Handler.throwError("We do not have that rim with that id.", 404);
		}
		return next();
	};

	rimNameVal = async (req: SearchReqDTO, res: Response, next: NextFunction) => {
		const { searchText } = req.params;
		if (!searchText) Handler.throwError("SearchText, required!", 400);
		return next();
	};

	rimConfigVal = async (req: RimByConfigDTO, res: Response, next: NextFunction) => {
		const { mountingHoles, width, diameter } = req.body;
		if (!mountingHoles || !width || !diameter) {
			Handler.throwError("Body with diameter, width and mountingHoles, required!", 400);
		}
		return next();
	};
}

export default new RimsInfoMid();
