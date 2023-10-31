import { varchar, bigint, pgTable, serial, jsonb } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { rims } from "./rimsSchema";
import { ConfigsDBDTO } from "../../DTOs/dbDTos";

export type RimConfigs = InferSelectModel<typeof rimConfigs>;
export type NewRimConfigs = InferInsertModel<typeof rimConfigs>;

export const rimConfigs = pgTable("configs", {
	configId: serial("configId").notNull().primaryKey(),
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => rims.rimId),
	configurations: jsonb("configurations").$type<ConfigsDBDTO>().notNull(),
	color: varchar("color", { length: 255 }).notNull(),
	type: varchar("type", { length: 255 }).notNull(),
});
