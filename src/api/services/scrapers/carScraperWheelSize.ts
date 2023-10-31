import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

const scrapBrands = (rawAxios: AxiosResponse): string[] => {
	const $ = cheerio.load(rawAxios.data);
	const carBrands = $("ul[class='unstyled list-inline text-uppercase']");
	const brands = carBrands
		.map((indx, el) => {
			return $(el).text().split("\n");
		})
		.get()
		.map(el => el.trim())
		.filter(el => el);
	return [...new Set(brands)];
};

const scrapModels = (rawAxios: AxiosResponse): string[] => {
	const $ = cheerio.load(rawAxios.data);
	const brandModels = $("div[id='alphabet']");
	let models = brandModels
		.map((indx, el) => {
			return $(el).text().replace("Production Models:", "").replace("Discontinued Models:", "").split("\n");
		})
		.get();
	models = models.map(el => el.trim()).filter(el => el);
	return models.reduce((previous: string[], next: string, index: number) => {
		if (index % 3 === 0) {
			previous.push(next);
		}
		if (index % 3 !== 0) {
			const lng = previous.length - 1;
			previous[lng] = previous[lng] + " " + next;
		}
		return previous;
	}, []);
};

const scrapConfigsPup = async (url: string) => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(url);

	const divContent = await page.evaluate(() => {
		const divElement = document.querySelector(".row.data-parameters.mb-2");
		if (divElement === null || divElement.textContent == null) {
			throw new Error("Div not found");
		}
		return divElement.textContent.trim();
	});
	await browser.close();

	return divContent
		.split("\n")
		.map(el => el.trim())
		.filter(el => el);
};

const scrapConfigs = async (rawAxios: AxiosResponse) => {
	const $ = cheerio.load(rawAxios.data);
	const modelsConfigs = $("ul[class='parameter-list parameter-list-right fa-ul ml-4 mb-0']");
	let configs = modelsConfigs
		.map((indx, el) => {
			return $(el).text().split("\n");
		})
		.get();
	return configs.map(el => el.trim()).filter(el => el);
};
const modelNameYear = (modelInfo: string): { name: string; year: string } => {
	const infoArr = modelInfo.split(" ");
	const name = infoArr[0].toLowerCase().replaceAll(" ", "-").replace(":", "-").replace("+", "plus").replace("(GWM)", "");
	const year = infoArr[1];
	return { name, year };
};

const url = "https://www.wheel-size.com/size/";

export const wheelSizeScraper = async () => {
	try {
		const allBrands = scrapBrands(await axios.get(url));

		allBrands.slice(0, 1).forEach(async brand => {
			const brand4Url = brand.toLowerCase().replace(" ", "-");
			const allModels = scrapModels(await axios.get(`${url + brand4Url}/`));

			allModels.slice(0, 1).forEach(async model => {
				const { name, year } = modelNameYear(model);

				//const configs = await scrapConfigs(await axios.get(`${url}${brand4Url}/${name}/${year}/`));

				const configs = await scrapConfigsPup(`${url}${brand4Url}/${name}/${year}/`);

				console.log("file: carScraperWheelSize.ts:90 ~ configs:", configs);
			});
		});
	} catch (err) {
		if (err) console.error("Error scraping car rim info from https://www.wheel-size.com");
	}
};

wheelSizeScraper();
