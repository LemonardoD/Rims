import { db } from "../db";
import { eq } from "drizzle-orm";
import { exchange } from "../schemas/exchangeSchema";

export async function getUsdExchange() {
	const result = await db.select().from(exchange).where(eq(exchange.currency, "usd"));
	return result[0].rate;
}

export async function updateUsdExchange(changeRate: number) {
	return await db.update(exchange).set({ rate: changeRate }).where(eq(exchange.currency, "usd"));
}
