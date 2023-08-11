import { jsonb, integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { RimVariationsDTO } from "../../DTOs/dbDTos";

export type Rim = InferModel<typeof newRim>;
export type NewRim = InferModel<typeof newRim, "insert">;

export const newRim = pgTable("new_rim_config", {
	rimId: bigint("rimId", <{ mode: "number" | "bigint" }>{}),
	rimBrand: varchar("rimBrand", { length: 255 }),
	rimName: varchar("rimName", { length: 255 }),
	rimConfigs: jsonb("rimConfigs").$type<RimVariationsDTO[]>(),
	pageName: varchar("pageName", { length: 255 }),
	pageVisits: integer("pageVisits"),
	miniImg: varchar("miniImg"),
	allImgs: jsonb("allImgs").$type<string[]>(),
});
