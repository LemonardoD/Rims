import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { rimConfigSearch } from "../../helpers/rimByTireCalculator";

const scrapBrands = (rawAxios: AxiosResponse): string[] => {
	const $ = cheerio.load(rawAxios.data);
	const carBrands = $("center");
	return carBrands
		.map((indx, el) => {
			return $(el).text();
		})
		.get();
};

const scrapModels = (rawAxios: AxiosResponse): string[] => {
	const $ = cheerio.load(rawAxios.data);
	const carModels = $("tbody");
	return carModels
		.map((indx, el) => {
			return $(el)
				.text()
				.split("\n")
				.filter(model => model);
		})
		.get();
};

const scrapConfigs = (rawAxios: AxiosResponse): string[] => {
	const $ = cheerio.load(rawAxios.data);
	const carConfig = $("table[id='zoek-op-merk']");
	return carConfig
		.map((indx, el) => {
			return $(el).text().split("\n");
		})
		.get();
};

const modelName = (name: string): string => {
	let srchArr = name.split(" ");
	if (srchArr.includes("Rear")) return name.replace("Rear", "Achteras");

	if (srchArr.includes("Front")) return name.replace("Front", "Vooras");

	return name;
};

const convertConfig = (rawConfig: string[]) => {
	const indexTireS = rawConfig.indexOf("Possible tire sizes: ");
	const tireInfo = rawConfig.slice(indexTireS)[1];
	if (rawConfig[1] === "This car has different wheel size on front and rear axel.") {
		return {
			pcd: rawConfig[2].replace("PCD: ", ""),
			centerBore: rawConfig[3].replace("Center bore: ", ""),
			rims: rimConfigSearch(tireInfo),
		};
	}
	return {
		pcd: rawConfig[1].replace("PCD: ", ""),
		centerBore: rawConfig[2].replace("Center bore: ", ""),
		rims: rimConfigSearch(tireInfo),
	};
};

const wheelFitmentScraper = async () => {
	try {
		const allBrands = scrapBrands(await axios.get("https://www.wheel-fitment.com/car.html"));

		allBrands.slice(56, 57).forEach(async brand => {
			const allModels = scrapModels(await axios.get(`https://www.wheel-fitment.com/car/${brand}.html`));

			allModels.forEach(async model => {
				const configResp = scrapConfigs(await axios.get(`https://www.wheel-fitment.com/car/${brand}/${modelName(model)}.html`));
				const carModel = model.split(" ")[0];

				console.log({ brand: brand, model: carModel, config: convertConfig(configResp) });
				//console.log(convertConfig(configResp));
			});
		});
	} catch (err) {
		if (err) console.error(`Error scraping car rim info from https://www.wheel-fitment.com`);
	}
};

wheelFitmentScraper();
