import { boolean, timestamp } from "drizzle-orm/pg-core";

// columns.helpers.ts
export const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updateAt: timestamp(),
  isDeleted: boolean().default(false).notNull(),
  deletedAt: timestamp(),
};
