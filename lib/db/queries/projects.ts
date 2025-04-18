
// ----------------------------------------------------------------
// Project queries
import {projectTable} from "@/lib/db/schema";
import {desc, eq} from "drizzle-orm";
import {db} from "@/config/db";

export async function getProjectsByUserId(userId: string) {
    return db.select().from(projectTable).where(eq(projectTable.userId, userId)).orderBy(desc(projectTable.updatedAt));
}

export async function createProject(userId: string, name: string) {
    const [project] = await db
        .insert(projectTable)
        .values({
            name,
            userId,
        })
        .returning()

    return project
}

export async function updateProject(id: string, name: string) {
    const [project] = await db
        .update(projectTable)
        .set({
            name,
            updatedAt: new Date(),
        })
        .where(eq(projectTable.id, id))
        .returning()

    return project
}

export async function deleteProject(id: string) {
    await db.delete(projectTable).where(eq(projectTable.id, id))
}