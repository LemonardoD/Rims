import { integer, varchar, bigint, pgTable, serial, jsonb } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { rims } from "./rimsSchema";

export type Img = InferSelectModel<typeof images>;
export type NewImg = InferInsertModel<typeof images>;

export const images = pgTable("images", {
	imgId: serial("imgId").notNull().primaryKey(),
	miniImg: varchar("miniImg", { length: 255 }).notNull(),
	arrImg: jsonb("arrImg").$type<string[]>().notNull(),
	quality: integer("quality").notNull().default(0),
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{})
		.notNull()
		.references(() => rims.rimId),
});
