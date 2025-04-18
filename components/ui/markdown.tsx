"use client";

import React, { memo, useId, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import ObsidianCallout from "@/components/chat/Message/ObsidianCallout";
import { MapleMonoBold, MapleMonoItalic } from "@/app/fonts";
import {
  TableComponent,
  TbodyComponent,
  TdComponent,
  ThComponent,
  TheadComponent,
  TrComponent,
} from "../chat/Message/Table";
import { CodeComponent } from "../chat/Message/CodeComponent";
import equal from "fast-deep-equal";
import Link from "next/link";

export type MarkdownProps = {
  children: string;
  id?: string;
  className?: string;
  components?: Partial<Components>;
};

// Cache for parsed markdown blocks to avoid repeated parsing
const blockCache = new Map<string, string[]>();

// Optimized parsing function with caching
const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  if (blockCache.has(markdown)) {
    return blockCache.get(markdown)!;
  }

  const blocks = marked.lexer(markdown).map((token) => token.raw);
  blockCache.set(markdown, blocks);

  // Limit cache size to prevent memory leaks
  if (blockCache.size > 100) {
    // Fix: Check if the iterator has a value before using it
    const iterator = blockCache.keys().next();
    if (!iterator.done && iterator.value !== undefined) {
      blockCache.delete(iterator.value);
    }
  }

  return blocks;
};

// Regex pattern for highlighting, compiled once
// Biểu thức chính quy để phát hiện các đoạn văn bản được đánh dấu (nằm giữa hai dấu ==)
// const HIGHLIGHT_PATTERN = /(==.*?==)/g;

// // Optimized text component with memoized highlight parts
// const TextComponent = memo(
//   ({ children }: { children?: React.ReactNode }) => {
//     // Fix: Always call useMemo, but conditionally use its result
//     const parts = useMemo(() => {
//       return typeof children === "string"
//         ? children.split(HIGHLIGHT_PATTERN)
//         : [];
//     }, [children]);

//     if (typeof children !== "string") return <>{children}</>;

//     return (
//       <>
//         {parts.map((part, index) => {
//           if (part.startsWith("==") && part.endsWith("==")) {
//             const highlightText = part.slice(2, -2);
//             return (
//               <span key={`h-${index}`} className="bg-yellow-300 px-1 rounded">
//                 {highlightText}
//               </span>
//             );
//           }
//           return part ? (
//             <React.Fragment key={`t-${index}`}>{part}</React.Fragment>
//           ) : null;
//         })}
//       </>
//     );
//   },
//   (prevProps, nextProps) => {
//     // Only re-render if the string content changes
//     return prevProps.children === nextProps.children;
//   },
// );

// TextComponent.displayName = "TextComponent";

// Memoized styled components with proper prop types
interface StyledComponentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

const StrongComponent = memo(
  ({ className, children, ...props }: StyledComponentProps) => (
    <strong
      className={cn(`${MapleMonoBold.className} text-red-500`, className)}
      {...props}
    >
      {children}
    </strong>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.children === nextProps.children &&
      prevProps.className === nextProps.className
    );
  },
);

StrongComponent.displayName = "StrongComponent";

const ItalicComponent = memo(
  ({ className, children, ...props }: StyledComponentProps) => (
    <i
      className={cn(
        `${MapleMonoItalic.className} italic text-green-600`,
        className,
      )}
      {...props}
    >
      {children}
    </i>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.children === nextProps.children &&
      prevProps.className === nextProps.className
    );
  },
);

ItalicComponent.displayName = "ItalicComponent";

const BlockquoteComponent = memo(
  ({ children, ...props }: any) => (
    <ObsidianCallout props={props}>{children}</ObsidianCallout>
  ),
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  },
);

BlockquoteComponent.displayName = "BlockquoteComponent";

const PreComponent = memo(
  ({ children }: any) => <>{children}</>,
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  },
);

PreComponent.displayName = "PreComponent";

// Pre-defined components object created once outside component
const INITIAL_COMPONENTS: Partial<Components> = {
  code: CodeComponent,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  blockquote: BlockquoteComponent,
  strong: StrongComponent,
  em: ItalicComponent,
  pre: PreComponent,
  table: TableComponent,
  thead: TheadComponent,
  tbody: TbodyComponent,
  tr: TrComponent,
  th: ThComponent,
  td: TdComponent,
  // link
  a: ({ node, children, ...props }) => {
    return (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  // Add text component for highlighting
  // text: TextComponent,
};

// Optimized markdown block with deep equality check for components
const MemoizedMarkdownBlock = memo(
  ({
    content,
    components,
  }: {
    content: string;
    components: Partial<Components>;
  }) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.content === nextProps.content &&
      equal(prevProps.components, nextProps.components)
    );
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

// Main markdown component implementation
function MarkdownComponent({
  children,
  id,
  className,
  components: propComponents,
}: MarkdownProps) {
  const generatedId = useId();
  const blockId = id ?? generatedId;

  // Determine if custom components are provided
  const hasCustomComponents = propComponents !== undefined;

  // Merge custom components with defaults, or use defaults if no custom components are provided
  const components = useMemo(() => {
    return hasCustomComponents
      ? { ...INITIAL_COMPONENTS, ...propComponents }
      : INITIAL_COMPONENTS;
  }, [hasCustomComponents, propComponents]);

  // Only recompute blocks when content changes
  const blocks = useMemo(() => parseMarkdownIntoBlocks(children), [children]);

  // Memoize the key generation function
  const getBlockKey = useCallback(
    (block: string, index: number) => {
      // Use a hash of the first few characters for more stable keys
      const hash =
        block.length > 0
          ? block.charCodeAt(0) * 31 +
            (block.length > 1 ? block.charCodeAt(1) : 0)
          : 0;
      return `${blockId}-${index}-${hash}`;
    },
    [blockId],
  );

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock
          key={getBlockKey(block, index)}
          content={block}
          components={components}
        />
      ))}
    </div>
  );
}

// Create the final memoized component with custom comparison
const arePropsEqual = (
  prevProps: MarkdownProps,
  nextProps: MarkdownProps,
): boolean => {
  if (prevProps.id !== nextProps.id) return false;
  if (!equal(prevProps.children, nextProps.children)) return false;
  if (!equal(prevProps.className, nextProps.className)) return false;
  if (!equal(prevProps.components, nextProps.components)) return false;

  return true;
};

// Export memoized component with display name
const Markdown = memo(MarkdownComponent, arePropsEqual);
Markdown.displayName = "Markdown";

export { Markdown };
