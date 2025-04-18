import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { userTable } from "./authSchema"
import { messageTable } from "./messageSchema"
import type { InferSelectModel } from "drizzle-orm"

export const mediaFileTable = pgTable("media_file", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    messageId: uuid("message_id").references(() => messageTable.id, { onDelete: "set null" }),
    fileName: text("file_name").notNull(),
    fileType: text("file_type").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export type MediaFile = InferSelectModel<typeof mediaFileTable>

