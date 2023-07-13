import { doublePrecision, integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";

export const rimOffers = pgTable("rim_offers", {
	rimOfferId: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	priceUSD: doublePrecision("price_usd"),
	seller: varchar("vendor", { length: 255 }),
	rimId: bigint("rim_id", <{ mode: "number" | "bigint" }>{}),
	rimConfigId: bigint("rim_config_id", <{ mode: "number" | "bigint" }>{}),
});
