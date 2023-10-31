import { eq } from "drizzle-orm";
import { database } from "../../../configurations/dbConfiguration";
import { exchange } from "../schemas/exchangeSchema";

export async function usdExchRate() {
	const [{ rate }] = await database.select({ rate: exchange.rate }).from(exchange).where(eq(exchange.currency, "usd"));
	return rate;
}

export async function updateUsdExchange(changeRate: number) {
	return await database.update(exchange).set({ rate: changeRate }).where(eq(exchange.currency, "usd"));
}
