import { bigint, jsonb, varchar, pgTable } from "drizzle-orm/pg-core";

export const carModels = pgTable("car_model", {
	id: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	modelInfo: jsonb("info").$type<{
		years: null | { value: number; configs: [{ pcd: string; rims: [{ width: string; diameter: string }] }]; engines: string[] }[];
	}>(),
	carModel: varchar("name", { length: 255 }).notNull(),
	carBrandId: bigint("car_maker_id", <{ mode: "number" | "bigint" }>{}).notNull(),
	modelConfig: jsonb("config"),
});
