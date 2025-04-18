import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
// import { Vote } from "@/lib/db/schema";
import { UIMessage } from "ai";
import { memo } from "react";
import equal from "fast-deep-equal";
import { UIArtifact } from "./artifact";
import { UseChatHelpers } from "@ai-sdk/react";
import RenderMessage from "@/components/chat/Message/RenderMessage";

interface ArtifactMessagesProps {
  chatId: string;
  status: UseChatHelpers["status"];
  // votes: Array<Vote> | undefined;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  artifactStatus: UIArtifact["status"];
}

function PureArtifactMessages({
  chatId,
  status,
  // votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: ArtifactMessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col gap-4 h-full items-center overflow-y-scroll px-4 pt-20"
    >
      {messages.map((message, index) => (
        <RenderMessage
          key={message.id}
          // chatId={chatId}
          message={message}
          status={status}
          error={undefined}
          addToolResult={() => {}}
          onRetry={() => {}}

          // isLoading={status === "streaming" && index === messageSchema.length - 1}
          // vote={
          //   votes
          //     ? votes.find((vote) => vote.messageId === message.id)
          //     : undefined
          // }
          // setMessages={setMessages}
          // reload={reload}
          // isReadonly={isReadonly}
        />
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

function areEqual(
  prevProps: ArtifactMessagesProps,
  nextProps: ArtifactMessagesProps,
) {
  if (
    prevProps.artifactStatus === "streaming" &&
    nextProps.artifactStatus === "streaming"
  )
    return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  // if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual);
