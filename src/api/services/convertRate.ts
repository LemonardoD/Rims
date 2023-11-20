// import "dotenv/config";
// import axios from "axios";
// import cron from "node-cron";
// import { monoCurrencyDTO } from "../DTOs/otherDTOs";
// import Exchange from "../database/repositories/exchangeRepo";
// import Handler from "../helpers/handler";

// const { CURRENCY_CODE } = process.env;

// async function getMonoInfo() {
// 	return await axios({
// 		method: "get",
// 		url: "https://api.monobank.ua/bank/currency",
// 		responseType: "json",
// 	});
// }

// async function getUsdRate() {
// 	try {
// 		let rate = 0;
// 		const request = await getMonoInfo();
// 		request.data.map((currency: monoCurrencyDTO) => {
// 			if (currency.currencyCodeA === Number(CURRENCY_CODE)) rate = currency.rateBuy;
// 		});
// 		return rate;
// 	} catch (err) {
// 		throw err;
// 	}
// }

// cron.schedule("0 0 0 * * *", async () => {
// 	// did'n work with render(work only in payed version), but needed 4 app runs once a day
// 	const changeRate = await getUsdRate();
// 	if (!!changeRate) {
//		await Exchange.updateUsdExchange(changeRate);
// 	}
// });
