"use client";

import { memo, useState } from "react";
import equal from "fast-deep-equal";
import { Button } from "@/components/ui/button";
import { ProviderIcon } from "@/components/chat/Input/ProviderIcon";
import type { ModelProvider } from "@/types";
import InstructionsView from "@/components/chat/Input/InstructionsView";

interface ChatConfig {
  model: string;
  provider: ModelProvider;
  content: string;
  isEditing?: boolean;
}

interface ChatStatedProps {
  chatConfig: ChatConfig;
  onUpdateContent?: (content: string) => void;
  onToggleEdit?: () => void;
}

// Pure component implementation
function PureChatStated({
  chatConfig,
  onUpdateContent,
  onToggleEdit,
}: ChatStatedProps) {
  const [editedContent, setEditedContent] = useState(chatConfig.content);

  // Reset edited content when original content changes
  if (chatConfig.content !== editedContent && !chatConfig.isEditing) {
    setEditedContent(chatConfig.content);
  }

  const handleApplyChanges = () => {
    onUpdateContent?.(editedContent);
    onToggleEdit?.();
  };

  const handleDiscardChanges = () => {
    setEditedContent(chatConfig.content);
    onToggleEdit?.();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-full">
        <ProviderIcon provider={chatConfig.provider} />
      </div>

      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-medium">{chatConfig.model}</h3>
        </div>
        <div className="relative max-w-max h-max">
          {chatConfig.isEditing ? (
            <EditingView
              content={editedContent}
              onChange={setEditedContent}
              onApply={handleApplyChanges}
              onDiscard={handleDiscardChanges}
            />
          ) : (
            <InstructionsView
              content={chatConfig.content}
              onEdit={onToggleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Custom comparison function for the main component
const arePropsEqual = (
  prevProps: ChatStatedProps,
  nextProps: ChatStatedProps,
): boolean => {
  // Deep compare chatConfig to detect changes
  if (!equal(prevProps.chatConfig, nextProps.chatConfig)) return false;

  // We don't compare function props as they rarely change in identity
  // If they do change identity but not behavior, we don't want to re-render

  return true;
};

// Create memoized component with custom comparison
const ChatStated = memo(PureChatStated, arePropsEqual);

// Add displayName for easier debugging
ChatStated.displayName = "ChatStated";

export default ChatStated;

// Extracted and memoized EditingView component
interface EditingViewProps {
  content: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onDiscard: () => void;
}

const EditingView = memo(
  function PureEditingView({
    content,
    onChange,
    onApply,
    onDiscard,
  }: EditingViewProps) {
    return (
      <div className="relative h-full w-full">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="h-[600px] w-[900px] p-3 text-sm pb-14"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t bg-background flex justify-end items-center gap-2">
          <Button size="default" variant="outline" onClick={onDiscard}>
            Discard Changes
          </Button>
          <Button size="default" onClick={onApply}>
            Apply to this chat
          </Button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if content changes or if functions change identity
    return (
      prevProps.content === nextProps.content &&
      prevProps.onChange === nextProps.onChange &&
      prevProps.onApply === nextProps.onApply &&
      prevProps.onDiscard === nextProps.onDiscard
    );
  },
);

EditingView.displayName = "EditingView";
