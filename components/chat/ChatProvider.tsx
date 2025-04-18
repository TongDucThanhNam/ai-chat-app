"use client";

import { Fragment, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { Message as DBMessage } from "@/lib/db/schema";
import { convertToUIMessages } from "@/lib/utils";
import { useAgentStore } from "@/store/useAgentStore";

interface ChatProviderProps {
  chatId: string;
  initialMessages: DBMessage[];
  onChatReady: (chatHelpers: ReturnType<typeof useChat>) => void;
}

export default function ChatProvider({
  chatId,
  initialMessages,
  onChatReady,
}: ChatProviderProps) {
  const { toast } = useToast();

  // Get selectedAgent from Zustand store
  const selectedAgent = useAgentStore((state) => state.selectedAgent);

  // Memoize converted messageSchema
  const convertedMessages = useMemo(
    () => convertToUIMessages(initialMessages),
    [initialMessages],
  );

  // Memoize body object
  const chatBody = useMemo(
    () => ({
      generatedChatId: chatId,
      selectedChatModel: selectedAgent,
    }),
    [chatId, selectedAgent],
  );

  // Callbacks with proper dependency arrays
  const handleFinish = useCallback((message: any, options: any) => {
    console.log("Message: ", message);
    console.log("Options: ", options);
  }, []);

  const handleError = useCallback(
    (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    [toast],
  );

  const handleToolCall = useCallback(({ toolCall }: any) => {
    if (toolCall.toolName === "getLocation") {
      const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
      return cities[Math.floor(Math.random() * cities.length)];
    }

    if (toolCall.toolName === "getWeatherInformation") {
      const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
      return weatherOptions;
    }
  }, []);

  // Use the chat hook with memoized values
  const chatHelpers = useChat({
    initialMessages: convertedMessages,
    id: chatId,
    body: chatBody,
    onFinish: handleFinish,
    onError: handleError,
    onToolCall: handleToolCall,
    experimental_throttle: 100,
    maxSteps: 10,
    sendExtraMessageFields: false,
  });

  // Pass chat helpers to parent component
  useMemo(() => {
    onChatReady(chatHelpers);
  }, [chatHelpers, onChatReady]);

  // This component doesn't render anything visible
  return <Fragment />;
}
