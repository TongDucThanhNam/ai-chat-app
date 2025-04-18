"use client";

import { Fragment, memo } from "react";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import { Button } from "@/components/ui/button";
import { AlertCircle, Copy } from "lucide-react";
import type { TextUIPart } from "@ai-sdk/ui-utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextPartProps {
  part: TextUIPart;
  messageId: string;
  index: number;
  role: "system" | "user" | "assistant" | "data";
  status?: "submitted" | "streaming" | "ready" | "error";
}

function PureTextPart({ part, messageId, index, role, status }: TextPartProps) {
  const error = undefined;
  const onRetry = () => {
    // Retry logic here
  };

  const key = `message-${messageId}-part-${index}`;
  if (role === "user") {
    return (
      <Card
        className={cn(
          "justify-end items-end",
          status === "error" ? "border-red-400" : "border-gray-200",
        )}
      >
        <MessageContent className="bg-secondary  ">{part.text}</MessageContent>
        <MessageActions className="justify-end mr-8">
          {/* Error handling */}

          {error && (
            <Fragment>
              <MessageAction tooltip="Error occurred">
                {/* Error popover content */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-red-100 text-red-500 relative"
                    >
                      <AlertCircle className="size-4" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 border-red-200 shadow-lg">
                    {/* Error content */}
                    {/* {error.message} */}
                  </PopoverContent>
                </Popover>
              </MessageAction>

              {/* Retry */}
              <MessageAction tooltip="Retry">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-500"
                  onClick={onRetry}
                >
                  {/* Retry icon */}
                  Retry
                </Button>
              </MessageAction>
            </Fragment>
          )}
        </MessageActions>
      </Card>
    );
  }
  return (
    <Message key={key} className="justify-start">
      <div className="flex w-full flex-col gap-2">
        <MessageContent id={messageId} markdown>
          {part.text}
        </MessageContent>

        <MessageActions className="seft-start">
          <MessageAction tooltip="Copy to clipboard">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              // onClick={onCopy}
            >
              <Copy />
            </Button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  );
}

// Custom comparison function
const arePropsEqual = (
  prevProps: TextPartProps,
  nextProps: TextPartProps,
): boolean => {
  // Only re-render if text content changes or copy state changes
  if (prevProps.part.text !== nextProps.part.text) return false;
  return true;
};

const TextPart = memo(PureTextPart, arePropsEqual);
TextPart.displayName = "TextPart";

export default TextPart;
