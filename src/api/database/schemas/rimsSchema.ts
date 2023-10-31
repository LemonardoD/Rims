import { integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Rim = InferSelectModel<typeof rims>;
export type NewRim = InferInsertModel<typeof rims>;

export const rims = pgTable("rims", {
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.primaryKey(),
	rimName: varchar("rimName", { length: 255 }).notNull(),
	rimNameSuffix: varchar("rimNameSuffix", { length: 255 }),
	visits: integer("visits").notNull().default(0),
	brand: varchar("brand", { length: 255 }).notNull(),
});
