import { eq } from "drizzle-orm";
import { db } from "../../../configurations/dbConfiguration";
import { exchange } from "../schemas/exchangeSchema";

export async function getUsdExchange() {
	const [{ rate }] = await db.select({ rate: exchange.rate }).from(exchange).where(eq(exchange.currency, "usd"));
	return rate;
}

export async function updateUsdExchange(changeRate: number) {
	return await db.update(exchange).set({ rate: changeRate }).where(eq(exchange.currency, "usd"));
}
