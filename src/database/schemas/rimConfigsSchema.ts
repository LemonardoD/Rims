import { varchar, bigint, pgTable, serial, jsonb } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { ConfigsDBDTO } from "../../DTOs/dbDTos";
import { rims } from "./rimsSchema";

export type RimConfigs = InferModel<typeof rimConfigs>;
export type NewRimConfigs = InferModel<typeof rimConfigs, "insert">;

export const rimConfigs = pgTable("configs", {
	configId: serial("configId").notNull().primaryKey(),
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => rims.rimId),
	configurations: jsonb("configurations").$type<ConfigsDBDTO>().notNull(),
	color: varchar("color", { length: 255 }).notNull(),
	type: varchar("type", { length: 255 }).notNull(),
});
