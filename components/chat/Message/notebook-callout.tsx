import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  ScrollText,
  List,
  Lightbulb,
  HelpCircle,
  ThumbsDown,
  Bug,
  Terminal,
  Quote,
} from "lucide-react";
import { cva } from "class-variance-authority";

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

type NotebookCalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "type" | "icon"
> & {
  type?: string | CalloutType;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  /**
   * Force an icon
   */
  icon?: ReactNode;
};

const calloutVariants = cva(
  "my-6 flex flex-row gap-2 rounded border border-t-2 border-s-4 bg-fd-card p-3 text-sm text-fd-card-foreground shadow-md",
  {
    variants: {
      type: {
        note: "border-s-blue-500/50 border-t-blue-500/30",
        abstract: "border-s-blue-500/50 border-t-blue-500/30",
        info: "border-s-sky-400/50 border-t-sky-400/30",
        todo: "border-s-purple-500/50 border-t-purple-500/30",
        tip: "border-s-yellow-500/50 border-t-yellow-500/30",
        success: "border-s-green-500/50 border-t-green-500/30",
        question: "border-s-cyan-500/50 border-t-cyan-500/30",
        warning: "border-s-orange-500/50 border-t-orange-500/30",
        failure: "border-s-orange-600/50 border-t-orange-600/30",
        danger: "border-s-red-600/50 border-t-red-600/30",
        bug: "border-s-red-500/50 border-t-red-500/30",
        example: "border-s-slate-500/50 border-t-slate-500/30",
        quote: "border-s-gray-500/50 border-t-gray-500/30",
      },
    },
  },
);

export const NotebookCallout = forwardRef<HTMLDivElement, NotebookCalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    // Add type validation
    const validTypes: CalloutType[] = [
      "note",
      "abstract",
      "info",
      "todo",
      "tip",
      "success",
      "question",
      "warning",
      "failure",
      "danger",
      "bug",
      "example",
      "quote",
    ];

    // Handle case-insensitive type matching
    let validatedType: CalloutType = "quote"; // Default to quote if invalid

    if (typeof type === "string") {
      // Convert to lowercase for case-insensitive comparison
      const normalizedType = type.toLowerCase();

      // Check if the normalized type is valid
      if (validTypes.includes(normalizedType as CalloutType)) {
        validatedType = normalizedType as CalloutType;
      }
    }

    const calloutIconMap: Record<CalloutType, ReactNode> = {
      note: <Info className="size-5 fill-blue-500 text-fd-card" />,
      abstract: <ScrollText className="size-5 fill-blue-500 text-fd-card" />,
      info: <Info className="size-5 fill-sky-400 text-fd-card" />,
      todo: <List className="size-5 fill-purple-500 text-fd-card" />,
      tip: <Lightbulb className="size-5 fill-yellow-500 text-fd-card" />,
      success: <CheckCircle className="size-5 fill-green-500 text-fd-card" />,
      question: <HelpCircle className="size-5 fill-cyan-500 text-fd-card" />,
      warning: (
        <AlertTriangle className="size-5 fill-orange-500 text-fd-card" />
      ),
      failure: <ThumbsDown className="size-5 fill-orange-600 text-fd-card" />,
      danger: <AlertCircle className="size-5 fill-red-600 text-fd-card" />,
      bug: <Bug className="size-5 fill-red-500 text-fd-card" />,
      example: <Terminal className="size-5 fill-slate-500 text-fd-card" />,
      quote: <Quote className="size-5 fill-gray-500 text-fd-card" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          calloutVariants({
            type: validatedType,
          }),
          className,
        )}
        {...props}
      >
        {icon ?? calloutIconMap[validatedType]}
        <div className="min-w-0 flex-1">
          {title ? (
            <p className="not-prose mb-2 font-medium font-playwrite">{title}</p>
          ) : null}
          <div className="text-fd-muted-foreground prose-no-margin font-playwrite text-base">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

NotebookCallout.displayName = "NotebookCallout";
