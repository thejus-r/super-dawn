import "dotenv/config";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
});

export type DrizzleDB = NodePgDatabase<typeof schema>;

export type DrizzleTransaction = PgTransaction<
	PgQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
  >;

export const db = drizzle({ client: pool, schema });

export type Database = typeof db

export type TxOrDB = DrizzleDB | DrizzleTransaction
