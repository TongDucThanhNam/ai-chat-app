import { pgTable, text, timestamp, uuid, boolean, varchar } from "drizzle-orm/pg-core"
import type { InferSelectModel } from "drizzle-orm"

export const toolTable = pgTable("tool", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    visibility: varchar("visibility").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
})

export type Tool = InferSelectModel<typeof toolTable>

