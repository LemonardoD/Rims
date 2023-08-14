import { doublePrecision, integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";
import { rimItems } from "./rimItemsSchema";

export const rimConfig = pgTable("rim_configs", {
	rimConfigId: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	centerBore: doublePrecision("cb").notNull(),
	rimDiameter: varchar("d", { length: 255 }).notNull(),
	rimOffset: integer("et").notNull(),
	mountingHoles: varchar("pcd", { length: 255 }).notNull(),
	priceUSD: doublePrecision("price_usd").notNull(),
	rimWidth: varchar("w", { length: 255 }).notNull(),
	rimId: bigint("rim_id", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => rimItems.rimId),
	searchIndx: varchar("search_index", { length: 255 }).notNull(),
});
