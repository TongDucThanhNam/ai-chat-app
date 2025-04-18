"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createChat,
} from "@/lib/db/queries";
import { headers } from "next/headers";
import { generateText, Message } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { db } from "@/config/db";
import {chatTable} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel("title-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  //mutate the path
  revalidatePath("/api/project");
  return title;
}

export async function createNewChat(name: string, projectId?: string) {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chat = await createChat(session.user.id, name, projectId);

  return chat;
}

export async function assignChatToProject(
  chatId: string,
  projectId: string | null,
) {
  try {
    const result = await db
      .update(chatTable)
      .set({
        projectId: projectId,
        updatedAt: new Date(),
      })
      .where(eq(chatTable.id, chatId))
      .returning({ id: chatTable.id });

    // Return only the necessary serializable data
    return {
      success: true,
      chatId: result[0]?.id,
    };
  } catch (error) {
    console.error("Error assigning chat to project:", error);
    return {
      success: false,
      error: "Failed to assign chat to project",
    };
  }
}

export async function getChatsByProjectId(projectId: string) {
  const session: any = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(chatTable)
    .where(eq(chatTable.projectId, projectId))
    .orderBy(chatTable.createdAt);
}
