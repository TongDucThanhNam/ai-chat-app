// lib/db/schema/chatSchema.ts
// This file defines the schema for the "chatSchema" table in the database using Drizzle ORM.

import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { projectTable } from "./projectSchema";
import { userTable } from "./authSchema";
import type { InferSelectModel } from "drizzle-orm";

export const chatTable = pgTable("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projectTable.id, {
    onDelete: "set null",
  }),
  // agentId: uuid("agent_id")
  //     // .notNull()
  //     .references(() => agentSchema.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  title: text("title").notNull(),
  memoryEnabled: boolean("memory_enabled").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export type Chat = InferSelectModel<typeof chatTable>;