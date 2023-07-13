import { jsonb, varchar, bigint, pgTable } from "drizzle-orm/pg-core";

export const offers = pgTable("offers", {
	type: varchar("dtype", { length: 31 }).notNull(),
	offerId: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	itemId: bigint("item_id", <{ mode: "number" | "bigint" }>{}),
	rimAttrs: jsonb("attrs").$type<{
		et: number;
		count: number;
		width: string;
		vendor: string;
		diameter: string;
		centerBore: number;
		priceInUsd: number;
		boltPattern: string;
	}>(),
});
