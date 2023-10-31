import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

const { DRIZZLE_DATABASE_URL } = <{ DRIZZLE_DATABASE_URL: string }>process.env;

neonConfig.fetchConnectionCache = true;
export const database = drizzle(neon(DRIZZLE_DATABASE_URL));
