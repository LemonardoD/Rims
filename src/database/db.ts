import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
dotenv.config();

const { DRIZZLE_DATABASE_URL } = <{ DRIZZLE_DATABASE_URL: string }>process.env;

neonConfig.fetchConnectionCache = true;

const sql = neon(DRIZZLE_DATABASE_URL);
export const db = drizzle(sql);
