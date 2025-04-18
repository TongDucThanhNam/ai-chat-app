"use client";

import { memo, useState } from "react";
import { cx } from "class-variance-authority";
import { DocumentPreview } from "@/components/document/document-preview";
import {
  DocumentToolCall,
  DocumentToolResult,
} from "@/components/document/document";
import type { ToolInvocationUIPart } from "@ai-sdk/ui-utils";
import equal from "fast-deep-equal";
import { SearchSection } from "@/components/search-section";
import { SearchSkeleton } from "@/components/default-skeleton";

interface ToolInvocationPartProps {
  part: ToolInvocationUIPart;
  messageId: string;
  index: number;
  status: "submitted" | "streaming" | "ready" | "error";
}

function PureToolInvocationPart({
  part,
  messageId,
  index,
  status,
}: ToolInvocationPartProps) {
  const { toolInvocation } = part;
  const { toolName, toolCallId, state } = toolInvocation;
  const [isOpen, setIsOpen] = useState(true);
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // The state of the tool call when it was partially created.
  if (state === "partial-call") {
    return (
      <p key={`${messageId}-${index}-partial`}>
        <strong>Tool being called:</strong> {toolName}
      </p>
    );
  }

  // The state of the tool call when it was fully created.
  if (state === "call") {
    const { args } = toolInvocation;

    return (
      <div
        key={toolCallId}
        className={cx({
          skeleton: ["getWeather"].includes(toolName),
        })}
      >
        {toolName === "createDocument" ? (
          <DocumentPreview isReadonly={false} args={args} />
        ) : toolName === "updateDocument" ? (
          <DocumentToolCall type="update" args={args} isReadonly={false} />
        ) : toolName === "requestSuggestions" ? (
          <DocumentToolCall
            type="request-suggestions"
            args={args}
            isReadonly={false}
          />
        ) : toolName === "search" ? (
          <SearchSection
            status={status}
            tool={toolInvocation}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </div>
    );
  }

  // The state of the tool call when the result is available.
  if (state === "result") {
    const { result } = toolInvocation;

    return (
      <div key={toolCallId}>
        {toolName === "createDocument" ? (
          <DocumentPreview isReadonly={false} result={result} />
        ) : toolName === "updateDocument" ? (
          <DocumentToolResult
            type="update"
            result={result}
            isReadonly={false}
          />
        ) : toolName === "requestSuggestions" ? (
          <DocumentToolResult
            type="request-suggestions"
            result={result}
            isReadonly={false}
          />
        ) : toolName === "search" ? (
          <SearchSection
            status={status}
            tool={toolInvocation}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        ) : (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    );
  }

  return null;
}

// Custom comparison function
const arePropsEqual = (
  prevProps: ToolInvocationPartProps,
  nextProps: ToolInvocationPartProps,
): boolean => {
  // So sánh sâu đối tượng toolInvocation
  // Kiểm tra trạng thái có thay đổi không
  if (!equal(prevProps.status, nextProps.status)) return false; // Component will re-render

  if (!equal(prevProps.part.toolInvocation, nextProps.part.toolInvocation))
    return false; // Component will re-render

  return true; // Componetent will not re-render
};

const ToolInvocationPart = memo(PureToolInvocationPart, arePropsEqual);
ToolInvocationPart.displayName = "ToolInvocationPart";

export default ToolInvocationPart;
