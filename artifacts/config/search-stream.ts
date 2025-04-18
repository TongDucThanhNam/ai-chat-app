// Import agent nghiên cứu
import { researcher } from "@/lib/ai/tools/researcher";
import { saveMessages } from "@/lib/db/queries/messages";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
// Import các hàm tiện ích và kiểu dữ liệu
import {
  appendResponseMessages,
  convertToCoreMessages,
  createDataStreamResponse,
  DataStreamWriter,
  streamText,
} from "ai";
// Import hàm kiểm tra mô hình suy luận
// Import hàm xử lý khi kết thúc luồng
// import { handleStreamFinish } from "./handle-stream-finish";
// Import kiểu cấu hình luồng cơ bản

interface searchStreamPromps {
  id: string;
  models: Map<string, any>;
  selectedChatModel: any;
  systemPrompt: any;
  messages: any;
  userMessage: any;
  session: any;
}

// Hàm chính tạo phản hồi luồng cho tool-calling
export function createToolCallingStreamResponse({
  id,
  models,
  selectedChatModel,
  systemPrompt,
  messages,
  userMessage,
  session,
}: searchStreamPromps) {
  // Trả về một đối tượng phản hồi luồng
  return createDataStreamResponse({
    // Hàm thực thi chính của luồng
    execute: async (dataStream: DataStreamWriter) => {
      // Lấy các biến từ cấu hình

      try {
        // Chuyển đổi tin nhắn sang định dạng lõi
        const coreMessages = convertToCoreMessages(messages);
        // Cắt bớt tin nhắn để phù hợp với giới hạn token của mô hình

        // Chuẩn bị cấu hình cho nhà nghiên cứu
        const researcherConfig = researcher({
          messages: coreMessages,
          searchMode: true,
        });

        // Bắt đầu luồng văn bản với cấu hình nhà nghiên cứu
        const result = streamText({
          ...researcherConfig,
          experimental_generateMessageId: generateUUID,
          // Xử lý khi luồng kết thúc
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
        });

        // Bắt đầu tiêu thụ luồng văn bản
        result.consumeStream();

        // Gộp kết quả luồng vào luồng dữ liệu
        result.mergeIntoDataStream(dataStream);
      } catch (error) {
        // Log lỗi và ném lại lỗi nếu có
        console.error("Lỗi thực thi luồng:", error);
        throw error;
      }
    },
    // Hàm xử lý lỗi cho luồng
    onError: (error) => {
      // Log lỗi và trả về thông báo lỗi
      console.error("Lỗi luồng:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}
