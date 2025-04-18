// ----------------------------------------------------------------
import {Chat, chatTable} from "@/lib/db/schema";
import {and, desc, eq, isNull} from "drizzle-orm";
import {db} from "@/config/db";

export async function getUnassignedChatsByUserId(userId: string) {
    return db
        .select()
        .from(chatTable)
        .where(and(eq(chatTable.userId, userId), isNull(chatTable.projectId)))
        .orderBy(chatTable.updatedAt);
}

export async function getChatsByProjectId(projectId: string) {
    return db
        .select()
        .from(chatTable)
        .where(eq(chatTable.projectId, projectId))
        .orderBy(chatTable.updatedAt);
}

export async function createChat(
    userId: string,
    title: string,
    projectId?: string,
) {
    const [chat] = await db
        .insert(chatTable)
        .values({
            id: crypto.randomUUID(),
            projectId: projectId,
            // agentId: null,
            userId: userId,
            title: title,
            memoryEnabled: false,
            metadata: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            deletedAt: null,
        })
        .returning();

    return chat;
}

// Chat queries
export async function saveChat({
                                   id,
                                   userId,
                                   title,
                                   visibility = "private",
                                   memory = true,
                                   projectId = null,
                               }: {
    id: string;
    userId: string;
    title: string;
    visibility?: "public" | "private";
    memory?: boolean;
    projectId?: string | null;
}) {
    try {
        return await db.insert(chatTable).values({
            id: id,
            projectId: projectId,
            // agentId: null,
            userId: userId,
            title: title,
            memoryEnabled: memory,
            metadata: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            deletedAt: null,
        });
    } catch (error) {
        console.error("Failed to save chat in database");
        throw error;
    }
}

export async function updateChat(
    chatID: string,
    chat: Chat,
) {
    try {
        const updateData: any = {updatedAt: new Date()};
        return await db.update(chatTable).set({
            ...updateData,
            ...chat,
        }).where(eq(
            chatTable.id,
            chat.id,
        ));
    } catch (error) {
        console.error("Failed to update chat in database");
        throw error;
    }
}

/**
 * Get all chatSchema for a specific user
 * @param userId - The ID of the user
 * @returns Promise containing an array of Chat objects
 */
export async function getChatsByUserId({userId}: { userId: string }) {
    try {
        return await db
            .select()
            .from(chatTable)
            .where(eq(chatTable.userId, userId))
            .orderBy(desc(chatTable.updatedAt));
    } catch (error) {
        console.error("Failed to get chatSchema by user from database");
        throw error;
    }
}

export async function getChatById({id}: { id: string }): Promise<Chat> {
    try {
        // console.log("getChatById id", id)
        const [selectedChat] = await db
            .select()
            .from(chatTable)
            .where(eq(chatTable.id, id));
        return selectedChat;
    } catch (error) {
        console.error("Failed to get chat by id from database");
        throw error;
    }
}

export async function deleteChat(id: string) {
    await db.delete(chatTable).where(eq(chatTable.id, id));
}
