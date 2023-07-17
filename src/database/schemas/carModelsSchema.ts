import { bigint, jsonb, varchar, pgTable } from "drizzle-orm/pg-core";
import { CarModelsDTO } from "../../DTOs/dbDTos";

export const carModels = pgTable("car_model", {
	id: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	modelInfo: jsonb("info").$type<CarModelsDTO>(),
	carModel: varchar("name", { length: 255 }).notNull(),
	carBrandId: bigint("car_maker_id", <{ mode: "number" | "bigint" }>{}).notNull(),
	modelConfig: jsonb("config"),
});
