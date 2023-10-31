import { doublePrecision, varchar, pgTable, serial } from "drizzle-orm/pg-core";

export const exchange = pgTable("exchange_rate", {
	exchangeId: serial("exchangeId").notNull().primaryKey(),
	rate: doublePrecision("rate").notNull().default(0),
	currency: varchar("currency", { length: 255 }).notNull(),
});
