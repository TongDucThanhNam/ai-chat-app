// lib/db/schema/knowledgeSchema.ts

import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  varchar,
  jsonb,
  primaryKey,
  vector,
} from "drizzle-orm/pg-core";
import { userTable } from "./authSchema";
import type { InferSelectModel } from "drizzle-orm";

export const knowledgeBaseTable = pgTable("knowledge_base", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  visibility: varchar("visibility").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export type KnowledgeBase = InferSelectModel<typeof knowledgeBaseTable>;

export const knowledgeBaseShareTable = pgTable(
  "knowledge_base_share",
  {
    knowledgeBaseId: uuid("knowledge_base_id")
      .notNull()
      .references(() => knowledgeBaseTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    permissionLevel: varchar("permission_level").notNull(),
    sharedAt: timestamp("shared_at", { mode: "date" }).notNull().defaultNow(),
  },
  (kbs) => ({
    compoundKey: primaryKey({
      columns: [kbs.knowledgeBaseId, kbs.userId],
    }),
  }),
);

export type KnowledgeBaseShare = InferSelectModel<typeof knowledgeBaseShareTable>;

export const knowledgeBaseChunkTable = pgTable("knowledge_base_chunk", {
  id: uuid("id").primaryKey().defaultRandom(),
  knowledgeBaseId: uuid("knowledge_base_id")
    .notNull()
    .references(() => knowledgeBaseTable.id, { onDelete: "cascade" }),
  chunkContent: text("chunk_content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type KnowledgeBaseChunk = InferSelectModel<typeof knowledgeBaseChunkTable>;
