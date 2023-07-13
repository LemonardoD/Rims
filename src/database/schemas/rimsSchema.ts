import { jsonb, varchar, bigint, pgTable } from "drizzle-orm/pg-core";

export const tableRims = pgTable("rims", {
	RimsId: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	rimBrandName: varchar("brand_name", { length: 255 }),
	rimColor: varchar("color", { length: 255 }),
	rimImg: jsonb("images").$type<string[]>(),
	rimName: varchar("name", { length: 255 }),
	rimShortName: varchar("name_suffix", { length: 255 }),
	rimThumbnail: varchar("thumbnail", { length: 255 }),
	rimType: varchar("type", { length: 255 }),
});
