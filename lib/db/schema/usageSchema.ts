import {
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "./authSchema";
import { chatTable } from "./chatSchema";
import { messageTable } from "./messageSchema";
import { agentTable } from "./agentSchema";
import { modelTable } from "./modelSchema";
import { toolTable } from "./toolSchema";
import { planTable } from "./planSchema";
import type { InferSelectModel } from "drizzle-orm";

export const usageHistoryTable = pgTable("usage_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  traceId: uuid("trace_id"),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  chatId: uuid("chat_id").references(() => chatTable.id),
  messageId: uuid("message_id").references(() => messageTable.id),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => agentTable.id),
  modelId: uuid("model_id")
    .notNull()
    .references(() => modelTable.id),
  toolId: uuid("tool_id").references(() => toolTable.id),
  usageType: varchar("usage_type").notNull(),
  inputTokens: integer("input_tokens").notNull(),
  outputTokens: integer("output_tokens").notNull(),
  creditsConsumed: integer("credits_consumed").notNull(),
  cost: decimal("cost"),
  latencyMs: integer("latency_ms"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export type UsageHistory = InferSelectModel<typeof usageHistoryTable>;

export const creditTransactionTable = pgTable("credit_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(),
  amount: integer("amount").notNull(),
  relatedUsageId: uuid("related_usage_id").references(() => usageHistoryTable.id),
  relatedPlanId: uuid("related_plan_id").references(() => planTable.id),
  description: text("description").notNull(),
  adminUserId: uuid("admin_user_id").references(() => userTable.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type CreditTransaction = InferSelectModel<typeof creditTransactionTable>;
