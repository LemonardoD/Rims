import { doublePrecision, integer, varchar, bigint, pgTable, serial } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { newRim } from "./newRimConfig";

export type RimConfig = InferModel<typeof newRimConfig>;
export type NewRimConfig = InferModel<typeof newRimConfig, "insert">;

export const newRimConfig = pgTable("new_config_table", {
	configId: serial("configId").notNull().primaryKey(),
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => newRim.rimId),
	rimWidth: varchar("width", { length: 255 }).notNull(),
	rimDiameter: varchar("diameter", { length: 255 }).notNull(),
	centerBore: doublePrecision("centerBore").notNull(),
	mountingHoles: varchar("mountingHoles", { length: 255 }).notNull(),
	rimOffset: integer("rimOffset").notNull(),
	price: integer("price").notNull(),
});
