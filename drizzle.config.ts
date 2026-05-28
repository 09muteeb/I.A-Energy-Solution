/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql", // ← CHANGED FROM "mysql"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});