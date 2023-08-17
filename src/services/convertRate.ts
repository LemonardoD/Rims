import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";
import { monoCurrencyDTO } from "../DTOs/otherDTOs";
import { updateUsdExchange } from "../database/repositories/exchangeRepo";
dotenv.config();

const { CURRENCY_CODE } = process.env;

async function getMonoInfo() {
	return await axios({
		method: "get",
		url: "https://api.monobank.ua/bank/currency",
		responseType: "json",
	});
}

async function getUsdRate() {
	try {
		let rate = 0;
		const request = await getMonoInfo();
		request.data.map((currency: monoCurrencyDTO) => {
			if (currency.currencyCodeA === Number(CURRENCY_CODE)) {
				rate = currency.rateBuy;
			}
		});
		return rate;
	} catch (err) {
		console.log(err);
	}
}

// cron.schedule("0 0 0 * * *", async () => {
// 	// did'n work with render(work only in payed version), but needed 4 app runs once a day
// 	const changeRate = await getUsdRate();
// 	if (changeRate) {
// 		await updateUsdExchange(changeRate);
// 	}
// });