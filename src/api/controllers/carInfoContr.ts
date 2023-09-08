import { Request, Response } from "express";
import CarRepo from "../database/repositories/carsRepo";
import RimRepo from "../database/repositories/rimsRepo";
import { CarInfoMid } from "../middlewares/carInfoMidd";
import { CarBrModYrReqDTO, CarBrandAndModelReqDTO, CarBrandReqDTO, ResCarSearchDTO, SearchByCarReqDTO } from "../DTOs/otherDTOs";
import { rimByCarProcessor } from "../helpers/DBRespProcessors/rimByCarProcessor";
import { resultProcessor } from "../helpers/DBRespProcessors/basicProcessor";

class CarInfo extends CarInfoMid {
	allCarBrands = async (req: Request, res: Response) => {
		return this.response(
			200,
			(await CarRepo.getAllCarBrands().execute()).map(el => el.brand),
			res,
		);
	};

	carModels = async (req: CarBrandReqDTO, res: Response) => {
		const { brand } = req.params;
		return this.response(
			200,
			(await CarRepo.getCarModelsByBrand().execute({ brand: brand })).map(el => el.model),
			res,
		);
	};

	carYears = async (req: CarBrandAndModelReqDTO, res: ResCarSearchDTO) => {
		const { model } = req.params;
		return this.response(200, await CarRepo.getCarYearsByModel(model), res);
	};

	carConfig = async (req: CarBrModYrReqDTO, res: ResCarSearchDTO) => {
		const { brand, model } = req.params;
		const year = Number(req.params.year);
		return this.response(200, await CarRepo.getCarRimConfig({ brand, model, year }), res);
	};

	// searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => { // witch ll be better
	// 	const { rimBrand } = req.body;
	// 	const { pcd, rims } = res.locals;
	// 	function flatter(list: any) {
	// 		return list.reduce((prev: any, next: any) => {
	// 			return prev.concat(next);
	// 		}, []);
	// 	}
	// 	if (rimBrand === "all") {
	// 		let result = [];
	// 		for await (let el of rims) {
	// 			result.push(await RimRepo.getRimsByConfig(el.diameter, el.width, pcd, "all").execute());
	// 		}
	// 		return this.response(200, resultProcessor(flatter(result)), res);
	// 	}
	// 	let result = [];
	// 	for await (let el of rims) {
	// 		result.push(await RimRepo.getRimsByConfig(el.diameter, el.width, pcd, rimBrand).execute());
	// 	}
	// 	return this.response(200, resultProcessor(flatter(result)), res);
	// };

	searchRimsByCar = async (req: SearchByCarReqDTO, res: ResCarSearchDTO) => {
		const { rimBrand } = req.body;
		if (rimBrand === "all") {
			const rims = await RimRepo.getAllRims().execute();
			return this.response(200, rimByCarProcessor(rims, res.locals), res);
		}
		const rims = await RimRepo.getRimsByBrand().execute({ reqRinBrand: rimBrand });
		return this.response(200, rimByCarProcessor(rims, res.locals), res);
	};
}

export default new CarInfo();
