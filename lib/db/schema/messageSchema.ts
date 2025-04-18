// lib/db/schema/messageSchema.ts
// Messages table
import {
  boolean,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatTable } from "./chatSchema";
import { modelTable } from "./modelSchema";
import type { InferSelectModel } from "drizzle-orm";
import { userTable } from "./authSchema";

export const messageTable = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  attachments: json("attachments").notNull(),
  modelIdUsed: text("model_id_used"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export type Message = InferSelectModel<typeof messageTable>;

export const documentTable = pgTable(
  "document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["image"] })
      .notNull()
      .default("image"),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id),
  },
  // (table) => {
  //   return {
  //     pk: primaryKey({ columns: [table.id, table.createdAt] }),
  //   };
  // },
);

export type Document = InferSelectModel<typeof documentTable>;
