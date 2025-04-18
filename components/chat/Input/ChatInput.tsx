import { cn } from "@/lib/utils";
import { useCallback, memo, useRef } from "react";
import Textarea from "react-textarea-autosize";

interface ChatInputProps {
  chatId: string;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
}

function ChatInput({
  chatId,
  handleInputChange,
  handleSubmit,
  input,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Textarea
      spellCheck={true}
      id="ai-input"
      value={input}
      placeholder="What would you like to know?"
      ref={inputRef}
      rows={3}
      maxRows={5}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          if (input.trim().length === 0) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          handleSubmit();
        }
      }}
      className={cn(
        "flex min-h-[80px] w-full rounded-md bg-transparent px-6 py-2 text-sm",
        "placeholder:text-muted-foreground mt-4",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        "[&::-webkit-resizer]:hidden", // Hide the resize handle in WebKit browsers
        "[&::-moz-resizer]:hidden", // Hide the resize handle in Firefox
        "resize-none", // Ensure resize is disabled across all browsers
      )}
      onChange={handleInputChange}
      // onFocus={() => { }}
      // onBlur={() => { }}
      aria-label="Chat input"
    />
  );
}

// Custom comparison function for memoization
const propsAreEqual = (
  prevProps: ChatInputProps,
  nextProps: ChatInputProps,
) => {
  return prevProps.input === nextProps.input;
};

export default memo(ChatInput, propsAreEqual);
