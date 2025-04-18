import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { deepseek } from "@ai-sdk/deepseek";
import {
  extractReasoningMiddleware,
  type Message,
  wrapLanguageModel,
} from "ai";
import { createAzure } from "@quail-ai/azure-ai-provider";
import { getChatById, saveChat } from "@/lib/db/queries";
// import {getMostRecentUserMessage} from "@/lib/utils";
import { getCurrentUserId } from "@/app/actions/auth";
import { getMostRecentUserMessage } from "@/lib/utils";
import { Agent } from "@/types";
import { z } from "zod";
// import {getCurrentUserId} from "@/chat/actions/auth";

const azure = createAzure({
  endpoint: process.env.AZURE_API_ENDPOINT,
  apiKey: process.env.AZURE_API_KEY,
});

import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { toolSchema, toolSchemas } from '@/lib/ai/toolSchema';

const google = createGoogleGenerativeAI({
  // custom settings
  apiKey: process.env.GOOGLE_API_KEY,
});

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const yescale = createOpenAICompatible({
  name: "yescale",
  apiKey: process.env.YESCALE_API_KEY,
  baseURL: " https://api.yescale.io/v1",
});

import { generateTitleFromUserMessage } from "@/app/actions/chats";
import { systemPrompt } from "@/lib/ai/prompts";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { Session } from "better-auth/types";
import { researcher } from "@/lib/ai/tools/researcher";
import { artifactStreamResponse } from "@/artifacts/config/artifact-stream";
import { createToolCallingStreamResponse } from "@/artifacts/config/search-stream";

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
      isSearchEnabled,
    }: {
      id: string;
      messages: Array<Message>;
      selectedChatModel: Agent;
      isSearchEnabled: boolean;
    } = await req.json();
    // console.log('POST messageSchema', messageSchema);

    const currentSession = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });

    if (!currentSession) return new Response("Unauthorized", { status: 401 });
    const session: Session | undefined = currentSession.session;

    // console.log("Session: ", session);
    const chat = await getChatById({ id });

    // console.log("selectedChatModel", selectedChatModel);

    const userId = await getCurrentUserId();

    if (!userId) {
      return new Response(`Unauthorized: ${userId}`, { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response("No user message found", { status: 400 });
    }

    if (!chat) {
      console.log("Chat not found, creating a new one");
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });
      await saveChat({ id, userId: userId, title });
    } else {
      if (chat.userId !== userId) {
        return new Response(`Unauthorized this chat belong too ${userId}`, {
          status: 401,
        });
      }
    }

    const models = new Map<string, any>([
      [
        "qwen-qwq-32b",
        wrapLanguageModel({
          model: groq("qwen-qwq-32b", {}),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      ],
      [
        "DeepSeek-R1",
        wrapLanguageModel({
          model: deepseek("deepseek-reasoner"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      ],
      ["DeepSeek-V3", deepseek("deepseek-chat")],
      ["gemini-2.0-flash", yescale("gemini-2.0-flash")],
      ["GPT-4.1", yescale("gpt-4.1-2025-04-14")],
      [
        "o4-mini",
        wrapLanguageModel({
          model: openai("o4-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      ],
    ]);

    if (isSearchEnabled) {
      return createToolCallingStreamResponse({
        id,
        systemPrompt,
        models,
        selectedChatModel,
        messages,
        session,
        userMessage,
      });
    } else {
      return artifactStreamResponse({
        id,
        systemPrompt,
        models,
        selectedChatModel,
        messages,
        session,
        userMessage,
      });
    }
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
