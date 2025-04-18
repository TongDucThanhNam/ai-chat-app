import { Fragment } from "react";
import ChatTopbar from "@/components/chat/ChatHeader/ChatTopbar";
import ChatInterface from "@/components/chat/ChatInterface";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { Chat } from "@/lib/db/schema";

interface ChatComponentProps {
  // Define any props if needed
  chatId: string;
}

export default async function ChatComponent({ chatId }: ChatComponentProps) {
  // find chat by id
  const chat: Chat = await getChatById({
    id: chatId,
  });

  // Check if chat exists
  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  //query for messageSchema
  const messages = await getMessagesByChatId({
    id: chatId,
  });

  return (
    <Fragment>
      {/* Top bar with fixed height */}
      <ChatTopbar title={chat.title} />

      {/* Chat interface that takes up remaining space */}
      <div className="flex-1 overflow-auto">
        <ChatInterface
          chatId={chat.id}
          myMessages={convertToUIMessages(messages)}
        />
      </div>
    </Fragment>
  );
}
