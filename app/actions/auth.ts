"use server";
import { eq } from "drizzle-orm";
import { Session, userTable } from "@/lib/db/schema";
import { db } from "@/config/db";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getCurrentUserId() {
  // Get the session from the auth provider
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  // console.log('getCurrentUserId session', session)

  if (!session) {
    console.log("getCurrentUserId session is null");
    return null;
  }

  if (!session.user) {
    console.log("getCurrentUserId session.user is null");
    return null;
  }

  const userId: string = session.user.id;
  // console.log('getCurrentUserId userId', userId)

  // Check if user exists in the database
  const result = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId as string))
    .execute();

  // console.log('getCurrentUserId result', result)

  if (!result) {
    console.log("getCurrentUserId result is null");
    return null;
  }
  return result[0]?.id;
}
