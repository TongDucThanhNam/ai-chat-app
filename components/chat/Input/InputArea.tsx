import type React from "react";

import { Fragment, memo } from "react";
import InputToolbar from "./InputToolbar";
import { Card } from "@/components/ui/card";
import { useAgentChat } from "@/hooks/useAgentChat";
import ChatInput from "./ChatInput";
import { UIMessage } from "ai";
import { RepoBanner } from "./RepoBanner";

interface InputAreaProps {
  chatId: string;
  uiMessages: UIMessage[];
}

// Sử dụng memo để tránh re-render không cần thiết
const InputArea = memo(function InputArea({
  chatId,
  uiMessages,
}: InputAreaProps) {
  //get from useChat.
  const { input, handleInputChange, handleSubmit, stop, status } = useAgentChat(
    {
      chatId: chatId,
      initialMessages: uiMessages,
    },
  );

  return (
    <Fragment>
      <div className="relative w-full px-4 pt-2">
        <RepoBanner className="absolute bottom-full inset-x-9 translate-y-2 z-0 px-3" />

        <Card className="relative rounded-small border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/10">
          <div className="px-4 pt-2">
            <div className="relative flex flex-col">
              <ChatInput
                chatId={chatId}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                input={input}
              />

              <div className="mt-2 h-14 rounded-small0">
                <InputToolbar
                  onSend={handleSubmit}
                  status={status}
                  stop={stop}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
});

// Thêm displayName để dễ debug
InputArea.displayName = "InputArea";

export default InputArea;
