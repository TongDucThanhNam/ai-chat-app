import type React from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Lightbulb,
  List,
  Quote,
  ScrollText,
  Terminal,
  ThumbsDown,
  Bug,
} from "lucide-react";

export type CalloutType =
  | "note"
  | "abstract"
  | "info"
  | "todo"
  | "tip"
  | "success"
  | "question"
  | "warning"
  | "failure"
  | "danger"
  | "bug"
  | "example"
  | "quote";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutStyles: Record<
  CalloutType,
  { icon: React.ReactNode; className: string }
> = {
  note: {
    icon: <Info className="h-4 w-4" />,
    className: "bg-blue-200",
  },
  abstract: {
    icon: <ScrollText className="h-4 w-4" />,
    className: "bg-blue-100 text-blue-900 ",
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    className: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100",
  },
  todo: {
    icon: <List className="h-4 w-4" />,
    className:
      "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-100",
  },
  tip: {
    icon: <Lightbulb className="h-4 w-4" />,
    className: "bg-green-100 text-green-900",
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    className:
      "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100",
  },
  question: {
    icon: <HelpCircle className="h-4 w-4" />,
    className:
      "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    className:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
  },
  failure: {
    icon: <ThumbsDown className="h-4 w-4" />,
    className:
      "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100",
  },
  danger: {
    icon: <AlertCircle className="h-4 w-4" />,
    className: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
  },
  bug: {
    icon: <Bug className="h-4 w-4" />,
    className: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
  },
  example: {
    icon: <Terminal className="h-4 w-4" />,
    className:
      "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
  },
  quote: {
    icon: <Quote className="h-4 w-4" />,
    className: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  },
};

export function Callout({
  type = "note",
  title,
  children,
  className,
}: CalloutProps) {
  const { icon, className: typeClassName } = calloutStyles[type];
  return (
    <div
      className={cn(
        "my-4 rounded-lg border p-4 shadow-sm",
        typeClassName,
        className,
      )}
    >
      <div className="flex items-start space-x-2">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1">
          {title && <p className="mb-1 text-amber-600 font-medium">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
