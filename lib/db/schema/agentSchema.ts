import {integer, jsonb, pgTable, primaryKey, text, uuid, varchar,} from "drizzle-orm/pg-core";
import {modelTable} from "./modelSchema";
import {knowledgeBaseTable} from "./knowledgeSchema";
import type {InferSelectModel} from "drizzle-orm";
import {timestamps} from "@/lib/columns.helpers";

export const agentTable = pgTable("agent", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    // creatorUserId: uuid()
    //   .notNull()
    //   .references(() => user.id),
    visibility: varchar().notNull(),
    ...timestamps,
});

export type Agent = InferSelectModel<typeof agentTable>;

export const agentModelTable = pgTable(
    "agent_model",
    {
        agentId: uuid("")
            .notNull()
            .references(() => agentTable.id, {onDelete: "cascade"}),
        modelId: uuid("")
            .notNull()
            .references(() => modelTable.id, {onDelete: "cascade"}),
        modelRoleInAgent: varchar("model_role_in_agent").notNull(),
        configurationOverrides: jsonb("configuration_overrides"),
        stepOrder: integer("step_order"),
    },
    (am) => ({
        compoundKey: primaryKey({
            columns: [am.agentId, am.modelId, am.modelRoleInAgent],
        }),
    }),
);

export type AgentModel = InferSelectModel<typeof agentModelTable>;

export const agentKnowledgeBaseTable = pgTable(
    "agent_knowledge_base",
    {
        agentId: uuid("")
            .notNull()
            .references(() => agentTable.id, {onDelete: "cascade"}),
        knowledgeBaseId: uuid("")
            .notNull()
            .references(() => knowledgeBaseTable.id, {onDelete: "cascade"}),
    },
    (akb) => ({
        compoundKey: primaryKey({
            columns: [akb.agentId, akb.knowledgeBaseId],
        }),
    }),
);

export type AgentKnowledgeBase = InferSelectModel<typeof agentKnowledgeBaseTable>;
