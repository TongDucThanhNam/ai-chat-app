// lib/db/schema/creditSchema.ts
//

import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "@/lib/db/schema/authSchema";
import { InferSelectModel } from "drizzle-orm";

export const userCreditTable = pgTable("user_credit", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  credits: integer("credits").notNull().default(0),
  plan: varchar("plan", {
    length: 20,
    enum: ["free", "basic", "premium", "enterprise"],
  })
    .notNull()
    .default("free"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type UserCredit = InferSelectModel<typeof userCreditTable>;
