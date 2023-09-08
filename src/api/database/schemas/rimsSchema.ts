import { integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export type Rim = InferModel<typeof rims>;
export type NewRim = InferModel<typeof rims, "insert">;

export const rims = pgTable("rims", {
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.primaryKey(),
	rimName: varchar("rimName", { length: 255 }).notNull(),
	rimNameSuffix: varchar("rimNameSuffix", { length: 255 }),
	visits: integer("visits").notNull().default(0),
	brand: varchar("brand", { length: 255 }).notNull(),
});
