"use client";

import type React from "react";
import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, UserCircle2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Separator } from "./ui/separator";
import { LogoGoogle } from "./icons/icons";
import equal from "fast-deep-equal";

interface CollapsibleMessageProps {
  children: React.ReactNode;
  role: "user" | "assistant";
  isCollapsible?: boolean;
  isOpen?: boolean;
  header?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  showBorder?: boolean;
  showIcon?: boolean;
}

// Memoized MessageIcon component
const MessageIcon = memo(
  ({ role, showIcon }: { role: "user" | "assistant"; showIcon: boolean }) => {
    if (!showIcon) return null;

    return (
      <div className={cn("mt-[10px] w-5", role === "assistant" && "mt-4")}>
        {role === "user" ? (
          <UserCircle2 size={20} className="text-muted-foreground" />
        ) : (
          <LogoGoogle />
        )}
      </div>
    );
  },
);
MessageIcon.displayName = "MessageIcon";

// Memoized CollapsibleContent component
const MessageContent = memo(({ children }: { children: React.ReactNode }) => (
  <div className="py-2 flex-1">{children}</div>
));
MessageContent.displayName = "MessageContent";

// Memoized CollapsibleVariant component
const CollapsibleVariant = memo(
  ({
    isOpen,
    onOpenChange,
    header,
    children,
    showBorder,
  }: {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    header?: React.ReactNode;
    children: React.ReactNode;
    showBorder: boolean;
  }) => (
    <div className={cn("flex-1 p-4", showBorder && "border border-border/50")}>
      <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <div className="flex items-center justify-between w-full gap-2">
            {header && <div className="text-sm w-full">{header}</div>}
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
          <Separator className="my-4 border-border/50" />
          <MessageContent>{children}</MessageContent>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.showBorder === nextProps.showBorder &&
      equal(prevProps.header, nextProps.header) &&
      equal(prevProps.children, nextProps.children)
    );
  },
);
CollapsibleVariant.displayName = "CollapsibleVariant";

// Memoized NonCollapsibleVariant component
const NonCollapsibleVariant = memo(
  ({ children }: { children: React.ReactNode }) => (
    <div className="flex-1 rounded-2xl px-4">
      <MessageContent>{children}</MessageContent>
    </div>
  ),
  (prevProps, nextProps) => equal(prevProps.children, nextProps.children),
);
NonCollapsibleVariant.displayName = "NonCollapsibleVariant";

// Main component implementation
function CollapsibleMessageComponent({
  children,
  role,
  isCollapsible = false,
  isOpen = true,
  header,
  onOpenChange,
  showBorder = true,
  showIcon = true,
}: CollapsibleMessageProps) {
  // Memoize the content variant based on isCollapsible
  const content = useMemo(() => {
    if (isCollapsible) {
      return (
        <CollapsibleVariant
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          header={header}
          showBorder={showBorder}
        >
          {children}
        </CollapsibleVariant>
      );
    }
    return <NonCollapsibleVariant>{children}</NonCollapsibleVariant>;
  }, [isCollapsible, isOpen, onOpenChange, header, showBorder, children]);

  return (
    <div className="flex gap-3">
      <div className="relative flex flex-col items-center">
        <MessageIcon role={role} showIcon={showIcon} />
      </div>
      {content}
    </div>
  );
}

// Custom comparison function for the main component
const arePropsEqual = (
  prevProps: CollapsibleMessageProps,
  nextProps: CollapsibleMessageProps,
): boolean => {
  return (
    prevProps.role === nextProps.role &&
    prevProps.isCollapsible === nextProps.isCollapsible &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.showBorder === nextProps.showBorder &&
    prevProps.showIcon === nextProps.showIcon &&
    equal(prevProps.header, nextProps.header) &&
    equal(prevProps.children, nextProps.children) &&
    prevProps.onOpenChange === nextProps.onOpenChange
  );
};

// Export the memoized component
export const CollapsibleMessage = memo(
  CollapsibleMessageComponent,
  arePropsEqual,
);
