import { Response, Request } from "express";
import { RimsInfoMid } from "../middlewares/rimsInfoMidd";
import { RimBrandsReqDto, RimByConfigDto, RimIdReqDto } from "../DTOs/middlewareDTOs";
import RimRepo from "../database/repositories/rimsRepo";

class RimInfo extends RimsInfoMid {
	rimsByBrands = async (req: RimBrandsReqDto, res: Response) => {
		const { rimBrand } = req.body;
		if (rimBrand === "all") {
			return this.response(200, await RimRepo.getAllRims(), res);
		}
		return this.response(200, await RimRepo.getRimsByBrand(rimBrand), res);
	};

	rimByConfig = async (req: RimByConfigDto, res: Response) => {
		return this.response(200, await RimRepo.RimsByConfig(req.body), res);
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
}

export default new RimInfo();
