"use client";

import { memo } from "react";
import { ArrowUp, Settings, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgentSelector from "@/components/chat/Input/AgentSelector";

interface InputToolbarProps {
  onSend: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
}

// Tách ActionButton thành component riêng
const ActionButton = memo(function ActionButton({
  status,
  onSend,
  stop,
}: {
  status: "submitted" | "streaming" | "ready" | "error";
  onSend: () => void;
  stop: () => void;
}) {
  if (status === "ready") {
    return (
      <Button
        type="button"
        variant="icon"
        size="icon-sm"
        onClick={onSend}
        aria-label="Send message"
        className="flex items-center justify-center"
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="icon"
      size="icon-sm"
      onClick={stop}
      aria-label="Stop"
      className="flex items-center justify-center"
    >
      <Square className={"w-4 h-4"} />
    </Button>
  );
});

ActionButton.displayName = "ActionButton";

// Sử dụng memo cho component chính
export default function InputToolbar({
  onSend,
  status,
  stop,
}: InputToolbarProps) {
  // Không cần lấy selectedAgent từ props nữa
  // AgentSelector sẽ tự lấy từ store

  return (
    <div className="absolute left-3 right-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AgentSelector />

        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </div>

      <div className={"flex flex-row gap-3"}>
        <ActionButton status={status} onSend={onSend} stop={stop} />
      </div>
    </div>
  );
}
