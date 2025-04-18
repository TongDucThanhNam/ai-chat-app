import { defineConfig } from "drizzle-kit";

export default defineConfig({
  //Neon Postgres
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
