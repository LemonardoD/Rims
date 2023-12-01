import { bigint, jsonb, varchar, pgTable, index } from "drizzle-orm/pg-core";
import { carBrands } from "./carBrandsSchema";
import { CarModelsDTO } from "../../types/dbDto";
import { InferInsertModel } from "drizzle-orm";

export type NewModel = InferInsertModel<typeof carModels>;

export const carModels = pgTable("car_model", {
	id: bigint("id", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.primaryKey(),
	modelInfo: jsonb("info").$type<CarModelsDTO>().notNull(),
	carModel: varchar("name", { length: 255 }).notNull(),
	carBrandId: bigint("car_maker_id", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => carBrands.id),
});
