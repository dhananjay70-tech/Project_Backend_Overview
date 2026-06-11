import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env.config";

export default defineConfig({
  schema: "./src/app/*/*.schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
