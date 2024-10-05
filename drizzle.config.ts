import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  migrations: {
    prefix: "supabase",
  },
});
