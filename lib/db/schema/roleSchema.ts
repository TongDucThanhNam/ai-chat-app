import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { userTable } from "./authSchema";

export const roleTable = pgTable("role", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type Role = InferSelectModel<typeof roleTable>;

export const userRoleTable = pgTable(
  "user_role",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roleTable.id, { onDelete: "cascade" }),
  },
  (ur) => ({
    compoundKey: primaryKey({
      columns: [ur.userId, ur.roleId],
    }),
  }),
);

export type UserRole = InferSelectModel<typeof userRoleTable>;