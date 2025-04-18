import { pgTable, text, timestamp, uuid, decimal, integer, boolean, jsonb } from "drizzle-orm/pg-core"
import type { InferSelectModel } from "drizzle-orm"

export const planTable = pgTable("plan", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    monthlyCredits: integer("monthly_credits").notNull(),
    price: decimal("price").notNull(),
    maxProjects: integer("max_projects"),
    maxAgents: integer("max_agents"),
    maxKnowledgeBases: integer("max_knowledge_bases"),
    features: jsonb("features"),
    isActive: boolean("is_active").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
})

export type Plan = InferSelectModel<typeof planTable>

