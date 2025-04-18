"use client";

import { memo, useState, useEffect } from "react";
import equal from "fast-deep-equal";
import type { UIMessage } from "@ai-sdk/ui-utils";
import { Message, MessageContent } from "@/components/ui/message";
import MessagePartRenderer from "./MessagePartRenderer";
import { cn } from "@/lib/utils";

interface RenderMessageProps {
  message: UIMessage;
  status: "submitted" | "streaming" | "ready" | "error";
  error: Error | undefined;
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    result: any;
  }) => void;
  onRetry: () => void;
}

// Main RenderMessage component
function PureRenderMessage({
  status,
  message,
  error,
  addToolResult,
  onRetry,
}: RenderMessageProps) {
  console.log("message parts:", message.parts);
  console.log("message annotations:", message.annotations);
  const [isGenerating, setIsGenerating] = useState(false);

  // Xác định isGenerating dựa trên part cuối cùng
  useEffect(() => {
    if (!message.parts || message.parts.length === 0) {
      setIsGenerating(false);
      return;
    }

    // Lấy part cuối cùng
    const lastPart = message.parts[message.parts.length - 1];

    // Nếu part cuối cùng là step-start, set isGenerating = true
    if (lastPart.type === "step-start") {
      setIsGenerating(true);
    } else {
      setIsGenerating(false);
    }
  }, [message.parts]);

  // Common props for all message types
  const messageProps = {
    status,
    message,
    error,
  };

  // Render different components based on message role
  if (message.role === "system" || message.role === "data") {
    return (
      <Message key={message.id} {...messageProps}>
        <MessageContent>{message.content}</MessageContent>
      </Message>
    );
  }

  return (
    <Message
      key={message.id}
      className={cn(
        "flex flex-row-reverse",
        message.role === "assistant" ? "justify-end" : "",
      )}
      {...messageProps}
    >
      <div className="max-w-[100%] flex-1 sm:max-w-[75%]">
        <div className="justify-end">
          {message.parts?.map((part, index) => (
            <MessagePartRenderer
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating} // Vẫn truyền xuống để có thể sử dụng trong tương lai
              {...messageProps}
              role={message.role}
              key={`${message.id}-part-${index}`}
              part={part}
              index={index}
              messageId={message.id}
              status={status}
            />
          ))}
        </div>
      </div>
    </Message>
  );
}

// Custom comparison function for the main component
const arePropsEqual = (
  prevProps: RenderMessageProps,
  nextProps: RenderMessageProps,
): boolean => {
  // Compare simple props first
  if (prevProps.status !== nextProps.status) return false;

  // Deep compare complex objects
  if (!equal(prevProps.error, nextProps.error)) return false;
  if (!equal(prevProps.message, nextProps.message)) return false;

  // If none of the critical props changed, prevent re-render
  return true;
};

// Create memoized component with custom comparison
const RenderMessage = memo(PureRenderMessage, arePropsEqual);

// Add displayName for easier debugging
RenderMessage.displayName = "RenderMessage";

export default RenderMessage;
