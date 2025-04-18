"use client";

import { memo, useRef, useState } from "react";
import equal from "fast-deep-equal";
import type { Attachment, UIMessage } from "@ai-sdk/ui-utils";
import { useChat } from "@ai-sdk/react";
import { ChatContainer } from "@/components/ui/chat-container";
import ChatStated from "@/components/chat/Message/ChatStated";
import RenderMessage from "@/components/chat/Message/RenderMessage";
import { Artifact } from "@/components/artifact/artifact";
import { useAgentStore } from "@/store/useAgentStore";
import { ScrollButton } from "../ScrollButton";

interface ChatAreaProps {
  chatId: string;
  uiMessages: UIMessage[];
}

// Pure component implementation
function PureChatArea({ chatId, uiMessages }: ChatAreaProps) {
  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  // Store selectors - using individual selectors to prevent unnecessary re-renders
  const selectedAgent = useAgentStore((state) => state.selectedAgent);
  const updateAgentSystem = useAgentStore((state) => state.updateAgentSystem);

  // Chat hook
  const {
    messages,
    addToolResult,
    error,
    stop,
    input,
    setInput,
    handleSubmit,
    append,
    setMessages,
    reload,
    status,
  } = useChat({
    id: chatId,
    initialMessages: uiMessages,
  });

  // Toggle edit function - extracted to avoid recreating on each render
  const handleToggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="flex flex-col h-full">
      <div className="h-full w-full">
        <div className="flex h-full w-full flex-col items-center overflow-hidden">
          <ChatContainer
            autoScroll={true}
            className="w-full flex-1 space-y-4 px-4"
            ref={chatContainerRef}
            scrollToRef={bottomRef}
          >
            {messages.length === 0 && (
              <ChatStated
                chatConfig={{
                  model: selectedAgent.model.id,
                  provider: selectedAgent.model.provider,
                  content: selectedAgent.system,
                  isEditing: isEditing,
                }}
                onToggleEdit={handleToggleEdit}
                onUpdateContent={updateAgentSystem}
              />
            )}

            {messages.map((message) => (
              <div key={message.id}>
                <RenderMessage
                  status={status}
                  message={message}
                  error={error}
                  addToolResult={addToolResult}
                  onRetry={() => {}}
                />
              </div>
            ))}
          </ChatContainer>

          <div className="absolute left-1/2 bottom-52 -translate-x-1/2 z-10">
            <ScrollButton
              containerRef={chatContainerRef}
              scrollRef={bottomRef}
              className="shadow-sm"
            />
          </div>
        </div>
      </div>

      <Artifact
        chatId={chatId}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
      />
    </div>
  );
}

// Custom comparison function for memoization
const arePropsEqual = (
  prevProps: ChatAreaProps,
  nextProps: ChatAreaProps,
): boolean => {
  // Only re-render if chatId changes
  if (prevProps.chatId !== nextProps.chatId) return false;

  // Deep compare messageSchema array to detect actual changes
  if (!equal(prevProps.uiMessages, nextProps.uiMessages)) return false;

  // If none of the critical props changed, prevent re-render
  return true;
};

// Create memoized component with custom comparison
const ChatArea = memo(PureChatArea, arePropsEqual);

// Add displayName for easier debugging
ChatArea.displayName = "ChatArea";

export default ChatArea;
