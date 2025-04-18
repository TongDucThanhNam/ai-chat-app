"use client";

import { Fragment, memo, useRef } from "react";
import { generateUUID } from "@/lib/utils";
import type { Message as DBMessage } from "@/lib/db/schema";
import ChatArea from "@/components/chat/Message/ChatArea";
import InputArea from "@/components/chat/Input/InputArea";
import { DataStreamHandler } from "@/components/artifact/data-stream-handler";
import equal from "fast-deep-equal";
import { UIMessage } from "ai";

interface ChatInterfaceProps {
  chatId?: string;
  myMessages: UIMessage[];
}

// Pure component implementation
function PureChatInterface({ chatId, myMessages }: ChatInterfaceProps) {
  // Use useRef for values that shouldn't trigger re-renders
  const generatedChatIdRef = useRef(generateUUID());

  // Calculate the actual chatId - no need for useMemo since we're using useRef
  const actualChatId = chatId || generatedChatIdRef.current;

  return (
    <Fragment>
      <div className="flex-1 h-full w-full overflow-hidden">
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 h-full overflow-hidden">
            <ChatArea chatId={actualChatId} uiMessages={myMessages} />
            <DataStreamHandler id={actualChatId} />
          </div>

          <div className="bg-background">
            <InputArea chatId={actualChatId} uiMessages={myMessages} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: ChatInterfaceProps,
  nextProps: ChatInterfaceProps,
): boolean => {
  // Only re-render if chatId changes (when it's provided)
  if (prevProps.chatId !== nextProps.chatId) return false;

  // Deep compare messageSchema array to detect actual changes
  if (!equal(prevProps.myMessages, nextProps.myMessages)) return false;

  // If none of the critical props changed, prevent re-render
  return true;
};

// Export memoized component with custom comparison
export default memo(PureChatInterface, arePropsEqual);
