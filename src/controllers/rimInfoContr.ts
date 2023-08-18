import { Response, Request } from "express";
import RimRepo from "../database/repositories/rimsRepo";
import { RimsInfoMid } from "../middlewares/rimsInfoMidd";
import { RimBrandsReqDTO, RimByConfigDTO, RimIdReqDTO, SearchReqDTO } from "../DTOs/otherDTOs";
import { searchAlike } from "../helpers/searchNaming";

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
		return this.response(200, await RimRepo.getRimById(id), res);
	};

	rimsPopular = async (req: Request, res: Response) => {
		return this.response(200, await RimRepo.getPopularRims(), res);
	};

	rimsByName = async (req: SearchReqDTO, res: Response) => {
		const { searchText } = req.body;
		const brand = searchAlike(searchText);
		if (brand) {
			return this.response(200, await RimRepo.getRimsByName(brand), res);
		}
		return this.response(200, await RimRepo.getRimsByName(searchText), res);
	};

	rimByConfig = async (req: RimByConfigDTO, res: Response) => {
		return this.response(200, await RimRepo.RimsByAllConfig(req.body), res);
	};
}

export default new RimInfo();
