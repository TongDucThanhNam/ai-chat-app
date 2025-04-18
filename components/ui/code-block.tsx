"use client";

import { cn } from "@/lib/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { codeToHtml } from "shiki";
import { MapleMonoNormal } from "@/app/fonts";

export type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

// Memoize the container component to prevent unnecessary re-renders [^1]
const CodeBlock = React.memo(function CodeBlock({
  children,
  className,
  ...props
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border bg-card text-card-foreground rounded-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Cache for highlighted code to prevent redundant processing
const highlightCache = new Map<string, string>();

export type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: string;
  className?: string;
  throttleMs?: number;
} & React.HTMLProps<HTMLDivElement>;

// Memoize the code component for better performance
const CodeBlockCode = React.memo(function CodeBlockCode({
  code = "",
  language = "tsx",
  theme = "github-light",
  className,
  throttleMs = 50, // Default throttle value
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const prevCodeRef = useRef(code);
  const prevLangRef = useRef(language);
  const prevThemeRef = useRef(theme);

  // Create a cache key for storing highlighted results
  const cacheKey = useMemo(
    () => `${code}:${language}:${theme}`,
    [code, language, theme],
  );

  // Throttled state updater to prevent too many UI updates [^3][^4]

  // Memoize the highlight function to prevent recreation on every render
  const highlight = useCallback(async () => {
    // Skip if nothing changed to avoid unnecessary work [^1]
    if (
      prevCodeRef.current === code &&
      prevLangRef.current === language &&
      prevThemeRef.current === theme
    ) {
      return;
    }

    // Update refs for future comparison
    prevCodeRef.current = code;
    prevLangRef.current = language;
    prevThemeRef.current = theme;

    // Check cache first

    setIsLoading(true);

    try {
      // Use a microtask to avoid blocking the main thread
      await new Promise((resolve) => setTimeout(resolve, 0));
      const html = await codeToHtml(code, { lang: language, theme });

      // Store in cache for future use
      highlightCache.set(cacheKey, html);
    } catch (error) {
      console.error("Error highlighting code:", error);
      setIsLoading(false);
    }
  }, [code, language, theme, cacheKey]);

  // Effect to trigger highlighting when dependencies change
  useEffect(() => {
    highlight();

    // Cleanup function to handle component unmounting
    return () => {
      // If cache gets too large, we could implement cleanup here
      if (highlightCache.size > 100) {
        // Clear oldest entries (simplified approach)
        const keys = Array.from(highlightCache.keys());
        for (let i = 0; i < keys.length - 50; i++) {
          highlightCache.delete(keys[i]);
        }
      }
    };
  }, [highlight]);

  // Memoize class names to prevent recalculation
  const classNames = useMemo(
    () =>
      cn(
        `${MapleMonoNormal.className} w-full overflow-x-auto [&>pre]:px-4 [&>pre]:py-4`,
        className,
      ),
    [className],
  );

  // Show loading state or fallback while highlighting
  if (isLoading) {
    return (
      <div className={classNames} {...props}>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  // Render highlighted HTML or fallback
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
});

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

// Memoize the group component
const CodeBlockGroup = React.memo(function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export { CodeBlockGroup, CodeBlockCode, CodeBlock };
