import { varchar, bigint, pgTable } from "drizzle-orm/pg-core";

export const carBrands = pgTable("car_maker", {
	id: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	carBrand: varchar("name", { length: 255 }).notNull(),
});
