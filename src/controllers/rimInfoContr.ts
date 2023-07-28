import { Response, Request } from "express";
import { RimsInfoMid } from "../middlewares/rimsInfoMidd";
import { RimBrandsReqDTO, RimByConfigDTO, RimIdReqDTO, SearchReqDTO } from "../DTOs/otherDTOs";
import RimRepo from "../database/repositories/rimsRepo";
import RimByConfRepo from "../database/repositories/rimsByConfRepo";
import { CustomError } from "../helpers/errThrower";

class RimInfo extends RimsInfoMid {
	rimsByBrands = async (req: RimBrandsReqDTO, res: Response) => {
		const { rimBrand } = req.body;
		if (rimBrand === "all") {
			return this.response(200, await RimRepo.getAllRims(), res);
		}
		return this.response(200, await RimRepo.getRimsByBrand(rimBrand), res);
	};

	rimConfigs = async (req: Request, res: Response) => {
		return this.response(200, await RimRepo.getRimConfigs(), res);
	};

	rimById = async (req: RimIdReqDTO, res: Response) => {
		const id = Number(req.body.id);
		await RimRepo.updateVisits(id);
		let response = await RimRepo.getConfigRimById(id);
		if (!response.rimVariations.length) {
			return this.response(200, await RimRepo.getRimByIdOffer(id), res);
		}
		return this.response(200, response, res);
	};

	rimsPopular = async (req: Request, res: Response) => {
		return this.response(200, await RimRepo.getPopularRims(), res);
	};

	rimsByName = async (req: SearchReqDTO, res: Response) => {
		const { searchText } = req.body;
		return this.response(200, await RimRepo.RimsByName(searchText), res);
	};

	rimByConfig = async (req: RimByConfigDTO, res: Response) => {
		const { mountingHoles, width, diameter } = req.body;
		if (mountingHoles && width && diameter) {
			return this.response(200, await RimByConfRepo.RimsByAllConfig(req.body), res);
		}
		if (!mountingHoles && !width && diameter) {
			return this.response(200, await RimByConfRepo.RimsByDiameterConfig(req.body), res);
		}
		if (!mountingHoles && !diameter && width) {
			return this.response(200, await RimByConfRepo.RimsByWidthConfig(req.body), res);
		}
		if (!width && !diameter && mountingHoles) {
			return this.response(200, await RimByConfRepo.RimsByMHConfig(req.body), res);
		}
		if (!mountingHoles && width && diameter) {
			return this.response(200, await RimByConfRepo.RimsByWDConfig(req.body), res);
		}
		if (!width && mountingHoles && diameter) {
			return this.response(200, await RimByConfRepo.RimsByMHDConfig(req.body), res);
		}
		if (!diameter && width && mountingHoles) {
			return this.response(200, await RimByConfRepo.RimsByMHWConfig(req.body), res);
		}
		throw new CustomError("Body with, diameter or width or mountingHoles, required!", 406);
	};
}

export default new RimInfo();
