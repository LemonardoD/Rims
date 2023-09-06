import { Response, Request } from "express";
import RimRepo from "../database/repositories/rimsRepo";
import { RimsInfoMid } from "../middlewares/rimsInfoMidd";
import { RimBrandsReqDTO, RimByConfigDTO, RimIdReqDTO, SearchReqDTO } from "../DTOs/otherDTOs";
import { searchAlike } from "../helpers/srchByNameAlike";
import { resultProcessor } from "../helpers/DBRespProcessors/basicProcessor";
import { rimByIdProcessor } from "../helpers/DBRespProcessors/rimByIdProcessor";
import { rimByNameProcessor } from "../helpers/DBRespProcessors/rimByNameProcessor";

class RimInfo extends RimsInfoMid {
	rimsByBrands = async (req: RimBrandsReqDTO, res: Response) => {
		const { rimBrand } = req.body;
		if (rimBrand === "all") {
			const rims = resultProcessor(await RimRepo.getAllRims().execute());
			return this.response(200, rims, res);
		}
		const rims = resultProcessor(await RimRepo.getRimsByBrand().execute({ reqRinBrand: rimBrand }));
		return this.response(200, rims, res);
	};

	rimById = async (req: RimIdReqDTO, res: Response) => {
		const id = Number(req.body.id);
		const rim = rimByIdProcessor(await RimRepo.getRimById().execute({ reqRimID: id }));
		await RimRepo.updateRimVisits().execute({ reqRimID: id });
		return this.response(200, rim, res);
	};

	rimsPopular = async (req: Request, res: Response) => {
		const { rimList } = resultProcessor(await RimRepo.getPopularRims().execute());
		return this.response(200, rimList.slice(0, 8), res);
	};

	rimsByName = async (req: SearchReqDTO, res: Response) => {
		const { searchText } = req.body;
		const brand = searchAlike(searchText);
		if (brand) return this.response(200, rimByNameProcessor(await RimRepo.getRimsByName().execute({ name: `%${brand}%` })), res);
		return this.response(200, rimByNameProcessor(await RimRepo.getRimsByName().execute({ name: `%${searchText}%` })), res);
	};

	rimByConfig = async (req: RimByConfigDTO, res: Response) => {
		const { diameter, width, mountingHoles } = req.body;
		const rims = await RimRepo.getRimsByConfig(diameter, width, mountingHoles).execute();
		return this.response(200, resultProcessor(rims), res);
		// return this.response(200, resultConfigProcessor(rims, req.body), res);
	};
}

export default new RimInfo();