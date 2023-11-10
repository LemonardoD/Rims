import { eq } from "drizzle-orm";
import { exchange } from "../schemas/exchangeSchema";
import { database } from "../../../configurations/dbConfiguration";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

class ExchangeRate {
	db;
	constructor(database: NeonHttpDatabase) {
		this.db = database;
	}
	usdExchRate = async () => {
		const [{ rate }] = await this.db.select({ rate: exchange.rate }).from(exchange).where(eq(exchange.currency, "usd"));
		return rate;
	};

	updateUsdExchange = async (changeRate: number) => {
		return await this.db.update(exchange).set({ rate: changeRate }).where(eq(exchange.currency, "usd"));
	};
}

export default new ExchangeRate(database);
