
// ----------------------------------------------------------------
// User credits queries
import {userCreditTable} from "@/lib/db/schema";
import {eq} from "drizzle-orm";
import {db} from "@/config/db";

export async function getUserCredits({userId}: { userId: string }) {
    try {
        const [userCredit] = await db.select().from(userCreditTable).where(eq(userCreditTable.userId, userId))

        return userCredit
    } catch (error) {
        console.error("Failed to get user credits from database")
        throw error
    }
}

export async function updateUserCredits({
                                            userId,
                                            credits,
                                            plan,
                                        }: {
    userId: string
    credits?: number
    plan?: "free" | "basic" | "premium" | "enterprise"
}) {
    try {
        const updateData: any = {updatedAt: new Date()}
        if (credits !== undefined) updateData.credits = credits
        if (plan !== undefined) updateData.plan = plan

        const existingCredits = await db.select().from(userCreditTable).where(eq(userCreditTable.userId, userId))

        if (existingCredits.length > 0) {
            return await db.update(userCreditTable).set(updateData).where(eq(userCreditTable.userId, userId))
        }

        return await db.insert(userCreditTable).values({
            userId,
            credits: credits || 0,
            plan: plan || "free",
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    } catch (error) {
        console.error("Failed to update user credits in database")
        throw error
    }
}