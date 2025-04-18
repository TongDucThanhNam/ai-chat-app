"use client";

import { memo } from "react";
import StepStartPart from "./StepStartPart";
import ReasoningPart from "./ReasoningPart";
import ToolInvocationPart from "./ToolInvocationPart";
import TextPart from "./TextPart";
import SourcePart from "./SourcePart";

interface MessagePartRendererProps {
  part: any;
  index: number;
  messageId: string;
  status: "submitted" | "streaming" | "ready" | "error";
  role: "system" | "user" | "assistant" | "data";
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void; // Giữ lại để tương thích
}

/**
 * A component that renders different types of message parts
 * This is extracted to improve performance and reduce re-renders
 */
function PureMessagePartRenderer({
  part,
  index,
  messageId,
  status,
  role,
  isGenerating,
}: MessagePartRendererProps) {
  const { type } = part;

  // Render different components based on part type
  switch (type) {
    case "step-start":
      return (
        <StepStartPart
          messageId={messageId}
          index={index}
          isGenerating={isGenerating}
        />
      );

    case "reasoning":
      return (
        <ReasoningPart
          part={part}
          messageId={messageId}
          index={index}
          status={status}
        />
      );

    case "tool-invocation":
      return (
        <ToolInvocationPart
          part={part}
          messageId={messageId}
          index={index}
          status={status}
        />
      );

    case "text":
      return (
        <TextPart
          status={status}
          role={role}
          part={part}
          messageId={messageId}
          index={index}
        />
      );

    case "source":
      return <SourcePart part={part} messageId={messageId} index={index} />;

    default:
      return null;
  }
}

// Cải tiến hàm so sánh props
const arePropsEqual = (
  prevProps: MessagePartRendererProps,
  nextProps: MessagePartRendererProps,
): boolean => {
  // Luôn re-render nếu part thay đổi
  if (prevProps.part !== nextProps.part) return false;

  // Check các props khác
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.index !== nextProps.index) return false;
  if (prevProps.messageId !== nextProps.messageId) return false;
  if (prevProps.role !== nextProps.role) return false;
  if (prevProps.isGenerating !== nextProps.isGenerating) return false;

  return true;
};

const MessagePartRenderer = memo(PureMessagePartRenderer, arePropsEqual);
MessagePartRenderer.displayName = "MessagePartRenderer";

export default MessagePartRenderer;
