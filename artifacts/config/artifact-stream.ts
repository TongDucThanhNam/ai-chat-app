import { createDocument } from "@/lib/ai/tools/create-document";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { saveMessages } from "@/lib/db/queries/messages";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
import { openai } from "@ai-sdk/openai";
import {
  appendResponseMessages,
  createDataStreamResponse,
  extractReasoningMiddleware,
  smoothStream,
  streamText,
  wrapLanguageModel,
} from "ai";

interface ArtifactStreamResponse {
  id: string;
  models: Map<string, any>;
  selectedChatModel: any;
  systemPrompt: any;
  messages: any;
  userMessage: any;
  session: any;
}

export function artifactStreamResponse({
  id,
  models,
  selectedChatModel,
  systemPrompt,
  messages,
  userMessage,
  session,
}: ArtifactStreamResponse) {
  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model:
          models.get(selectedChatModel.model.id) ||
          wrapLanguageModel({
            model: openai("o4-mini"), // Fallback model
            middleware: extractReasoningMiddleware({ tagName: "think" }),
          }),
        temperature: selectedChatModel.temperature,
        topP: selectedChatModel.topP,
        providerOptions: {
          openai: {
            reasoningEffort: "low",
          },
        },
        system: systemPrompt({
          selectedChatModel: selectedChatModel.model.id as string,
        }),
        messages,
        maxSteps: 5,
        // experimental_activeTools:
        //   selectedChatModel === "chat-model-reasoning"
        //     ? []
        //     : [
        //         "getWeather",
        //         "createDocument",
        //         "updateDocument",
        //         "requestSuggestions",
        //       ],
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateUUID,
        onError: (error) => {
          console.error("Error in streamText:", error);
        },
        toolCallStreaming: true,

        tools: {
          createDocument: createDocument({ session, dataStream }),
          updateDocument: updateDocument({ session, dataStream }),
          // requestSuggestions: requestSuggestions({
          //   session,
          //   dataStream,
          // }),
        },
        onFinish: async ({ response, usage }) => {
          if (session.userId) {
            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (message) => message.role === "assistant",
                ),
              });

              if (!assistantId) {
                throw new Error("No assistant message found!");
              }

              const [, assistantMessage] = appendResponseMessages({
                messages: [userMessage],
                responseMessages: response.messages,
              });

              await saveMessages({
                myMessages: [
                  {
                    id: assistantId,
                    chatId: id,
                    role: assistantMessage.role,
                    parts: assistantMessage.parts,
                    attachments:
                      assistantMessage.experimental_attachments ?? [],
                    modelIdUsed: selectedChatModel.model.id,
                    inputTokens: isNaN(usage.promptTokens)
                      ? null
                      : (usage.promptTokens ?? 0),
                    outputTokens: isNaN(usage.completionTokens)
                      ? null
                      : (usage.completionTokens ?? 0),
                    isDeleted: false,
                    deletedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
              });
            } catch (_) {
              console.error("Failed to save chat");
            }
          }
        },
        // experimental_telemetry: {
        //   isEnabled: isProductionEnvironment,
        //   functionId: "stream-text",
        // },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return "Oops, an error occurred!";
    },
  });
}
