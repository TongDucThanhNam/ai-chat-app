"use client";

import { useState, useCallback } from "react";
import type { TextUIPart } from "@ai-sdk/ui-utils";

interface UseMessageActionsProps {
  message: {
    parts?: Array<any>;
    content?: string;
  };
  timeout?: number;
}

/**
 * Custom hook to handle message actions like copying
 */
export function useMessageActions({
  message,
  timeout = 2000,
}: UseMessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = useCallback(() => {
    setCopied(true);

    // Extract text from message parts or use content directly
    let textToCopy = "";

    if (message.parts) {
      textToCopy = message.parts
        .filter((part) => part.type === "text")
        .map((part) => (part as TextUIPart).text)
        .join("\n");
    } else if (message.content) {
      textToCopy = message.content;
    }

    navigator.clipboard.writeText(textToCopy);

    // Reset copied state after timeout
    setTimeout(() => {
      setCopied(false);
    }, timeout);
  }, [message, timeout]);

  return {
    copied,
    setCopied,
    liked,
    setLiked,
    handleCopy,
  };
}
