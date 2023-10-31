import { InferInsertModel } from "drizzle-orm";
import { varchar, bigint, pgTable } from "drizzle-orm/pg-core";

export type NewBrand = InferInsertModel<typeof carBrands>;

export const carBrands = pgTable("car_maker", {
	id: bigint("id", <{ mode: "number" | "bigint" }>{})
		.primaryKey()
		.notNull(),
	carBrand: varchar("name", { length: 255 }).notNull(),
});
