import { integer, varchar, bigint, pgTable, serial, jsonb } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export type Img = InferModel<typeof images>;
export type NewImg = InferModel<typeof images, "insert">;

export const images = pgTable("images", {
	imgId: serial("imgId").notNull().primaryKey(),
	miniImg: varchar("miniImg", { length: 255 }).notNull(),
	arrImg: jsonb("arrImg").$type<string[]>().notNull(),
	quality: integer("quality").notNull(),
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{}).notNull(),
});
