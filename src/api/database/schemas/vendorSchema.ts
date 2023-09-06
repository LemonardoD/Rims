import { varchar, bigint, pgTable, serial, integer } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { rims } from "./rimsSchema";
import { rimConfigs } from "./rimConfigsSchema";

export type Vendors = InferModel<typeof vendors>;
export type NewVendor = InferModel<typeof vendors, "insert">;

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
