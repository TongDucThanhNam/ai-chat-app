// ----------------------------------------------------------------
// User queries
import {User, userTable} from "@/lib/db/schema";
import {eq} from "drizzle-orm"
import {db} from "@/config/db";


/**
 * Retrieves a user from the database based on their email.
 *
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Array<User>>} A promise that resolves to an array of User objects.
 * @throws Will throw an error if the database query fails.
 * */
export async function getUser(email: string): Promise<Array<User>> {
    try {
        return await db.select().from(userTable).where(eq(userTable.email, email))
    } catch (error) {
        console.error("Failed to get user from database")
        throw error
    }
}


/**
 * Get all chatSchema for a specific user
 * @param userId - The ID of the user
 * @returns Promise containing an array of Chat objects
 */
// export async function getChatsByUserId(userId: string): Promise<Chat[]> {
//     try {
//         const userChats = await db.select().from(chatSchema).where(eq(chatSchema.userId, userId)).orderBy(chatSchema.updatedAt)
//
//         return userChats
//     } catch (error) {
//         console.error("Error fetching chatSchema for user:", error)
//         throw new Error("Failed to fetch user chatSchema")
//     }
// }

/**
 * Get a specific chat by ID and verify it belongs to the user
 * @param chatId - The ID of the chat
 * @param userId - The ID of the user
 * @returns Promise containing the Chat object or null if not found
 */

// export async function getChatByIdAndUserId(chatId: string, userId: string): Promise<Chat | null> {
//     try {
//         const [userChat] = await db
//             .select()
//             .from(chatSchema)
//             .where(eq(chatSchema.id, chatId))
//             .where(eq(chatSchema.userId, userId))
//             .limit(1)
//
//         return userChat || null
//     } catch (error) {
//         console.error("Error fetching chat:", error)
//         throw new Error("Failed to fetch chat")
//     }
// }
