// lib/db/schema/projectSchema.ts
// Projects table - using UUID type
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { userTable } from "./authSchema";
import type { InferSelectModel } from "drizzle-orm";

export const projectTable = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  introduce: text("introduce"),
  basePrompt: text("base_prompt"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export type Project = InferSelectModel<typeof projectTable>;

export const projectMemberTable = pgTable(
  "project_member",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    role: varchar("role").notNull(),
    joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  },
  (pm) => ({
    compoundKey: primaryKey({
      columns: [pm.projectId, pm.userId],
    }),
  }),
);

export type ProjectMember = InferSelectModel<typeof projectMemberTable>;

export const organizationTable = pgTable("organization", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export type Organization = InferSelectModel<typeof organizationTable>;

export const memberTable = pgTable("member", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export type Member = InferSelectModel<typeof memberTable>;

export const invitationTable = pgTable("invitation", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export type Invitation = InferSelectModel<typeof invitationTable>;
