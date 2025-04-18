
// ----------------------------------------------------------------
// Knowledge base queries
import {knowledgeBaseTable} from "@/lib/db/schema";
import {desc, eq} from "drizzle-orm";
import {db} from "@/config/db";


export async function getKnowledgeBaseByUserId({id}: { id: string }) {
    try {
        return await db
            .select()
            .from(knowledgeBaseTable)
            .where(eq(knowledgeBaseTable.userId, id))
            .orderBy(desc(knowledgeBaseTable.updatedAt))
    } catch (error) {
        console.error("Failed to get knowledge base by user from database")
        throw error
    }
}