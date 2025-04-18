// lib/db/schema/modelSchema.ts
// AI Models table
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  varchar,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

export const modelTable = pgTable("model", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  provider: varchar("provider").notNull(),
  modelIdentifier: text("model_identifier").notNull(),
  contextWindow: integer("context_window").notNull(),
  inputCostPerMillionTokens: decimal("input_cost_per_million_tokens").notNull(),
  outputCostPerMillionTokens: decimal(
    "output_cost_per_million_tokens",
  ).notNull(),
  isReasoning: boolean("is_reasoning").notNull(),
  isActive: boolean("is_active").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type Model = InferSelectModel<typeof modelTable>;
