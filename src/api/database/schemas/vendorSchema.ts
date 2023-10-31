import { varchar, bigint, pgTable, serial, integer } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { rims } from "./rimsSchema";
import { rimConfigs } from "./rimConfigsSchema";

export type Vendors = InferSelectModel<typeof vendors>;
export type NewVendor = InferInsertModel<typeof vendors>;

export const vendors = pgTable("vendors", {
	vendorId: serial("vendorId").notNull().primaryKey(),
	vendorType: varchar("vendorType", { length: 255 }).notNull(),
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => rims.rimId),
	rimConfigId: bigint("rimConfigId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => rimConfigs.rimId),
	price: integer("price").notNull().default(0),
	unitsLeft: integer("unitsLeft").notNull().default(0),
});
