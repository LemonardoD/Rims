import { jsonb, integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";
import { ItemsAttributesDTO } from "../../DTOs/dbDTos";

export const rimItems = pgTable("items", {
	type: varchar("dtype", { length: 31 }).notNull(),
	rimId: bigint("id", <{ mode: "number" | "bigint" }>{}).notNull(),
	rimBrand: varchar("brand_name", { length: 255 }),
	imgQual: integer("image_quality").notNull(),
	arrImgNames: jsonb("images").$type<string[]>(),
	rimName: varchar("name", { length: 255 }),
	imgName: varchar("thumbnail", { length: 255 }),
	visits: integer("visits_count"),
	rimAttrs: jsonb("attrs").$type<ItemsAttributesDTO>(),
});
