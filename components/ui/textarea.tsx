import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[40px] w-full rounded-md bg-transparent px-6 py-2 text-sm",
          "placeholder:text-muted-foreground mt-4",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
          "[&::-webkit-resizer]:hidden", // Hide the resize handle in WebKit browsers
          "[&::-moz-resizer]:hidden", // Hide the resize handle in Firefox
          "resize-none", // Ensure resize is disabled across all browsers
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
