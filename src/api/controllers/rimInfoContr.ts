import Handler from "../helpers/handler";
import { Response, Request } from "express";
import RimRepo from "../database/repositories/rimsRepo";
import { searchAlike } from "../helpers/srchByNameAlike";
import { resultProcessor } from "../helpers/DBRespProcessors/basicProcessor";
import { rimByIdProcessor } from "../helpers/DBRespProcessors/rimByIdProcessor";
import { BrandReqDTO, RimByConfigDTO, RimIdReqDTO, SearchReqDTO } from "../types/otherDto";

class RimInfo {
	rimsByBrands = async (req: BrandReqDTO, res: Response) => {
		const { brand } = req.params;
		if (brand === "all") {
			const rims = resultProcessor(await RimRepo.allRims().execute());
			return Handler.sendResponse(200, rims, res);
		}
		const rims = resultProcessor(await RimRepo.rimsByBrand().execute({ reqRimBrand: brand }));
		return Handler.sendResponse(200, rims, res);
	};

	rimById = async (req: RimIdReqDTO, res: Response) => {
		const id = Number(req.params.id);
		const rim = rimByIdProcessor(await RimRepo.rimById().execute({ reqRimID: id }));
		await RimRepo.updateRimVisits().execute({ reqRimID: id });
		return Handler.sendResponse(200, rim, res);
	};

	rimsPopular = async (req: Request, res: Response) => {
		const { rimList } = resultProcessor(await RimRepo.popularRims().execute());
		return Handler.sendResponse(200, rimList.slice(0, 8), res);
	};

	rimsByName = async (req: SearchReqDTO, res: Response) => {
		const { searchText } = req.params;
		const brand = searchAlike(searchText);
		if (brand) {
			const { rimList } = resultProcessor(await RimRepo.rimsByName().execute({ name: `%${brand}%` }));
			return Handler.sendResponse(200, rimList, res);
		}
		const { rimList } = resultProcessor(await RimRepo.rimsByName().execute({ name: `%${searchText}%` }));
		return Handler.sendResponse(200, rimList, res);
	};

	rimByConfig = async (req: RimByConfigDTO, res: Response) => {
		const rims = await RimRepo.rimsByConfig(req.body).execute();
		return Handler.sendResponse(200, resultProcessor(rims), res);
	};
}

export default new RimInfo();
