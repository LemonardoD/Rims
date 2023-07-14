import { Response, Request } from "express";
import { RimsInfoMid } from "../middlewares/rimsInfoMidd";
import { RimBrandsReqDto, RimByConfigDto, RimIdReqDto, SearchReqDTO } from "../DTOs/middlewareDTOs";
import RimRepo from "../database/repositories/rimsRepo";
import RimByConfRepo from "../database/repositories/rimsByConfRepo";
import { CustomError } from "../helpers/errThrower";

class RimInfo extends RimsInfoMid {
	rimsByBrands = async (req: RimBrandsReqDto, res: Response) => {
		const { rimBrand } = req.body;
		if (rimBrand === "all") {
			return this.response(200, await RimRepo.getAllRims(), res);
		}
		return this.response(200, await RimRepo.getRimsByBrand(rimBrand), res);
	};

	rimConfigs = async (req: Request, res: Response) => {
		return this.response(200, await RimRepo.getRimConfigs(), res);
	};

	rimById = async (req: RimIdReqDto, res: Response) => {
		const { id } = req.body;
		await RimRepo.updateVisits(Number(id));
		return this.response(200, await RimRepo.getRimById(Number(id)), res);
	};

	rimsPopular = async (req: Request, res: Response) => {
		return this.response(200, await RimRepo.getPopularRims(), res);
	};

	rimsByName = async (req: SearchReqDTO, res: Response) => {
		const { searchText } = req.body;
		return this.response(200, await RimRepo.RimsByName(searchText), res);
	};

	rimByConfig = async (req: RimByConfigDto, res: Response) => {
		const { mountHoles, width, diameter } = req.body;
		if (mountHoles && width && diameter) {
			return this.response(200, await RimByConfRepo.RimsByAllConfig(req.body), res);
		}
		if (!mountHoles && !width && diameter) {
			return this.response(200, await RimByConfRepo.RimsByDiameterConfig(req.body), res);
		}
		if (!mountHoles && !diameter && width) {
			return this.response(200, await RimByConfRepo.RimsByWidthConfig(req.body), res);
		}
		if (!width && !diameter && mountHoles) {
			return this.response(200, await RimByConfRepo.RimsByMHConfig(req.body), res);
		}
		if (!mountHoles && width && diameter) {
			return this.response(200, await RimByConfRepo.RimsByWDConfig(req.body), res);
		}
		if (!width && mountHoles && diameter) {
			return this.response(200, await RimByConfRepo.RimsByMHDConfig(req.body), res);
		}
		if (!diameter && width && mountHoles) {
			return this.response(200, await RimByConfRepo.RimsByMHWConfig(req.body), res);
		}
		throw new CustomError("Body with, diameter, width, mountHoles, required!", 406);
	};
}

export default new RimInfo();
