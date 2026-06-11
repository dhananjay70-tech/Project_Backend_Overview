import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env.config";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export const connectDatabase = async (): Promise<void> => {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test connection
  const client = await pool.connect();
  client.release();

  db = drizzle(pool);
};

export const getDb = (): ReturnType<typeof drizzle> => {
  if (!db) {
    throw new Error(
      "Database not initialized. Call connectDatabase() first."
    );
  }
  return db;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
};
