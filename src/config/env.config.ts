import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .default("3000")
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(["development", "production", "test", "staging"])
    .default("development"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  CORS_ORIGIN: z.string().optional().default("*"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
