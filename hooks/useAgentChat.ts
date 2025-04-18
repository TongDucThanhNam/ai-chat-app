"use client";

import { Message, useChat } from "@ai-sdk/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useCallback, useMemo } from "react";
import { convertToUIMessages, useConvertToUIMessages } from "@/lib/utils";
import type { Message as DBMessage } from "@/lib/db/schema";
import { useAgentStore } from "@/store/useAgentStore";
import { UIMessage } from "ai";

export function useAgentChat({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: UIMessage[];
}) {
  const { toast } = useToast();

  // Lấy selectedAgent từ Zustand store
  const selectedAgent = useAgentStore((state) => state.selectedAgent);
  const isSearchEnabled = useAgentStore((state) => state.isSearchEnabled);

  // Chuyển đổi messageSchema

  // Tạo body object với selectedAgent
  const chatBody = useMemo(
    () => ({
      generatedChatId: chatId,
      selectedChatModel: selectedAgent,
      isSearchEnabled,
    }),
    [chatId, selectedAgent, isSearchEnabled],
  );

  const handleToolCall = useCallback(({ toolCall }: any) => {
    if (toolCall.toolName === "getLocation") {
      const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
      return cities[Math.floor(Math.random() * cities.length)];
    }

    if (toolCall.toolName === "getWeatherInformation") {
      const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
      // Return one option randomly for demonstration
      return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    }
    // It's good practice to return undefined or handle unknown tool calls
    return undefined;
  }, []); // Assuming tool logic doesn't depend on external state/props for now

  // Sử dụng useChat hook với các giá trị đã được memoize
  const chatApi = useChat({
    initialMessages: initialMessages,
    id: chatId,
    body: chatBody,
    onFinish: (message, options) => {
      const { finishReason, usage } = options;
      console.log("Message", message);
      // write chat id to url
      window.history.replaceState({}, "", `/chat/${chatId}`);

      toast({
        title: "Message from Assistant",
        description: `Reason: ${finishReason}, Usage: ${usage.totalTokens}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
    onToolCall: handleToolCall,
    experimental_throttle: 100, // Consider if this needs adjustment
    maxSteps: 10, // Consider if this needs adjustment
    sendExtraMessageFields: false,
  });

  // Return the result from useChat
  return chatApi;
}
