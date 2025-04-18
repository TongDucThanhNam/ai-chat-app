import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { MapleMonoMedium } from "@/app/fonts"; // Removed unused MapleMonoNormal

// --- Message ---
export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageComponent = ({ children, className, ...props }: MessageProps) => (
  <div className={cn("flex gap-3", className)} {...props}>
    {children}
  </div>
);
const Message = React.memo(MessageComponent);
Message.displayName = "Message";

// --- MessageAvatar ---
export type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

const MessageAvatarComponent = ({
  src,
  alt,
  fallback,
  delayMs,
  className,
}: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && (
        <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
};
const MessageAvatar = React.memo(MessageAvatarComponent);
MessageAvatar.displayName = "MessageAvatar";

// --- MessageContent ---
export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>;

const MessageContentComponent = ({
  children,
  markdown = false,
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    `p-2 ${MapleMonoMedium.className}`, // Using template literal for clarity
    className,
  );

  return markdown ? (
    <Markdown id={props.id} className={classNames} {...props}>
      {children as string}
    </Markdown>
  ) : (
    <div id={props.id} className={classNames} {...props}>
      {children}
    </div>
  );
};
const MessageContent = React.memo(MessageContentComponent);
MessageContent.displayName = "MessageContent";

// --- MessageActions ---
export type MessageActionsProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageActionsComponent = ({
  children,
  className,
  ...props
}: MessageActionsProps) => (
  <div
    className={cn("text-muted-foreground flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </div>
);
const MessageActions = React.memo(MessageActionsComponent);
MessageActions.displayName = "MessageActions";

// --- MessageAction ---
export type MessageActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

const MessageActionComponent = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: MessageActionProps) => {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
const MessageAction = React.memo(MessageActionComponent);
MessageAction.displayName = "MessageAction";

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageActions,
  MessageAction,
};
