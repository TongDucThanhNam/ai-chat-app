
// ----------------------------------------------------------------
// Model queries
import {modelTable} from "@/lib/db/schema";
import {asc, eq} from "drizzle-orm";
import {db} from "@/config/db";

export async function getAvailableModels() {
    try {
        return await db.select().from(modelTable).where(eq(modelTable.isActive, true)).orderBy(asc(modelTable.name))
    } catch (error) {
        console.error("Failed to get available modelSchema from database")
        throw error
    }
}
