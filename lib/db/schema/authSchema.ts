// lib/db/schema/authSchema.ts

import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
}, (table) => [
  uniqueIndex("email_idx").on(table.email), // Unique index for email
]);

export type User = InferSelectModel<typeof userTable>;

export const accountTable = pgTable("account", {
  id: uuid("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
}, (table) => [
  index("account_user_id_idx").on(table.userId), // Index for userId
]);

export type Account = InferSelectModel<typeof accountTable>;

export const sessionTable = pgTable("session", {
  id: uuid("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
}, (table) => [
  index("session_user_id_idx").on(table.userId), // Index for userId
  uniqueIndex("session_token_idx").on(table.token), // Unique index for token
]);

export type Session = InferSelectModel<typeof sessionTable>;

export const verificationTable = pgTable("verification", {
  id: uuid("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier), // Index for identifier
]);

export type Verification = InferSelectModel<typeof verificationTable>;