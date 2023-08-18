import { bigint, jsonb, varchar, pgTable } from "drizzle-orm/pg-core";
import { CarModelsDTO } from "../../DTOs/dbDTos";
import { carBrands } from "./carBrandsSchema";

export const carModels = pgTable("car_model", {
	id: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	modelInfo: jsonb("info").$type<CarModelsDTO>().notNull(),
	carModel: varchar("name", { length: 255 }).notNull(),
	carBrandId: bigint("car_maker_id", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => carBrands.id),
});
