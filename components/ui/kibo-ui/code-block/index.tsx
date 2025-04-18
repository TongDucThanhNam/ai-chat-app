"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type IconType,
  SiAstro,
  SiBiome,
  SiBower,
  SiBun,
  SiC,
  SiCircleci,
  SiCoffeescript,
  SiCplusplus,
  SiCss,
  SiCssmodules,
  SiDart,
  SiDocker,
  SiDocusaurus,
  SiDotenv,
  SiEditorconfig,
  SiEslint,
  SiGatsby,
  SiGitignoredotio,
  SiGnubash,
  SiGo,
  SiGraphql,
  SiGrunt,
  SiGulp,
  SiHandlebarsdotjs,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJson,
  SiLess,
  SiMarkdown,
  SiMdx,
  SiMintlify,
  SiMocha,
  SiMysql,
  SiNextdotjs,
  SiPerl,
  SiPhp,
  SiPostcss,
  SiPrettier,
  SiPrisma,
  SiPug,
  SiPython,
  SiR,
  SiReact,
  SiReadme,
  SiRedis,
  SiRemix,
  SiRive,
  SiRollupdotjs,
  SiRuby,
  SiSanity,
  SiSass,
  SiScala,
  SiSentry,
  SiShadcnui,
  SiStorybook,
  SiStylelint,
  SiSublimetext,
  SiSvelte,
  SiSvg,
  SiSwift,
  SiTailwindcss,
  SiToml,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebassembly,
} from "@icons-pack/react-simple-icons";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerMetaHighlight,
} from "@shikijs/transformers";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactElement } from "react";
import {
  cloneElement,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type BundledLanguage,
  type CodeOptionsMultipleThemes,
  codeToHtml,
} from "shiki";

// Cache for highlighted code to prevent redundant processing [^1]
const highlightCache = new Map<string, string>();

// Precompile regex patterns for filename matching to avoid runtime compilation [^1]
const filenamePatternCache = new Map<string, RegExp>();

// Memoized filename icon map to avoid recreating on each render [^1]
const filenameIconMap = {
  ".env": SiDotenv,
  "*.astro": SiAstro,
  "biome.json": SiBiome,
  ".bowerrc": SiBower,
  "bun.lockb": SiBun,
  "*.c": SiC,
  "*.cpp": SiCplusplus,
  ".circleci/config.yml": SiCircleci,
  "*.coffee": SiCoffeescript,
  "*.module.css": SiCssmodules,
  "*.css": SiCss,
  "*.dart": SiDart,
  Dockerfile: SiDocker,
  "docusaurus.config.js": SiDocusaurus,
  ".editorconfig": SiEditorconfig,
  ".eslintrc": SiEslint,
  "eslint.config.*": SiEslint,
  "gatsby-config.*": SiGatsby,
  ".gitignore": SiGitignoredotio,
  "*.go": SiGo,
  "*.graphql": SiGraphql,
  "*.sh": SiGnubash,
  "Gruntfile.*": SiGrunt,
  "gulpfile.*": SiGulp,
  "*.hbs": SiHandlebarsdotjs,
  "*.html": SiHtml5,
  "*.js": SiJavascript,
  "*.json": SiJson,
  "*.test.js": SiJest,
  "*.less": SiLess,
  "*.md": SiMarkdown,
  "*.mdx": SiMdx,
  "mintlify.json": SiMintlify,
  "mocha.opts": SiMocha,
  "*.mustache": SiHandlebarsdotjs,
  "*.sql": SiMysql,
  "next.config.*": SiNextdotjs,
  "*.pl": SiPerl,
  "*.php": SiPhp,
  "postcss.config.*": SiPostcss,
  "prettier.config.*": SiPrettier,
  "*.prisma": SiPrisma,
  "*.pug": SiPug,
  "*.py": SiPython,
  "*.python": SiPython,
  "*.r": SiR,
  "*.rb": SiRuby,
  "*.jsx": SiReact,
  "*.ts": SiTypescript,
  "*.tsx": SiReact,
  "readme.md": SiReadme,
  "*.rdb": SiRedis,
  "remix.config.*": SiRemix,
  "*.riv": SiRive,
  "rollup.config.*": SiRollupdotjs,
  "sanity.config.*": SiSanity,
  "*.sass": SiSass,
  "*.scss": SiSass,
  "*.sc": SiScala,
  "*.scala": SiScala,
  "sentry.client.config.*": SiSentry,
  "components.json": SiShadcnui,
  "storybook.config.*": SiStorybook,
  "stylelint.config.*": SiStylelint,
  ".sublime-settings": SiSublimetext,
  "*.svelte": SiSvelte,
  "*.svg": SiSvg,
  "*.swift": SiSwift,
  "tailwind.config.*": SiTailwindcss,
  "*.toml": SiToml,
  "vercel.json": SiVercel,
  "vite.config.*": SiVite,
  "*.vue": SiVuedotjs,
  "*.wasm": SiWebassembly,
};

// Memoized class names for better performance [^1]
const lineNumberClassNames = cn(
  "[&_code]:[counter-reset:line]",
  "[&_code]:[counter-increment:line_0]",
  "[&_.line]:before:content-[counter(line)]",
  "[&_.line]:before:inline-block",
  "[&_.line]:before:[counter-increment:line]",
  "[&_.line]:before:w-4",
  "[&_.line]:before:mr-4",
  "[&_.line]:before:text-[13px]",
  "[&_.line]:before:text-right",
  "[&_.line]:before:text-muted-foreground/50",
  "[&_.line]:before:font-mono",
  "[&_.line]:before:select-none",
);

const darkModeClassNames = cn(
  "dark:[&_.shiki]:!text-[var(--shiki-dark)]",
  "dark:[&_.shiki]:!bg-[var(--shiki-dark-bg)]",
  "dark:[&_.shiki]:![font-style:var(--shiki-dark-font-style)]",
  "dark:[&_.shiki]:![font-weight:var(--shiki-dark-font-weight)]",
  "dark:[&_.shiki]:![text-decoration:var(--shiki-dark-text-decoration)]",
  "dark:[&_.shiki_span]:!text-[var(--shiki-dark)]",
  "dark:[&_.shiki_span]:!bg-[var(--shiki-dark-bg)]",
  "dark:[&_.shiki_span]:![font-style:var(--shiki-dark-font-style)]",
  "dark:[&_.shiki_span]:![font-weight:var(--shiki-dark-font-weight)]",
  "dark:[&_.shiki_span]:![text-decoration:var(--shiki-dark-text-decoration)]",
);

const lineHighlightClassNames = cn(
  "[&_.line.highlighted]:bg-blue-50",
  "[&_.line.highlighted]:after:bg-blue-500",
  "[&_.line.highlighted]:after:absolute",
  "[&_.line.highlighted]:after:left-0",
  "[&_.line.highlighted]:after:top-0",
  "[&_.line.highlighted]:after:bottom-0",
  "[&_.line.highlighted]:after:w-0.5",
  "dark:[&_.line.highlighted]:bg-blue-800",
);

const lineDiffClassNames = cn(
  "[&_.line.diff]:after:absolute",
  "[&_.line.diff]:after:left-0",
  "[&_.line.diff]:after:top-0",
  "[&_.line.diff]:after:bottom-0",
  "[&_.line.diff]:after:w-0.5",
  "[&_.line.diff.add]:bg-emerald-50",
  "[&_.line.diff.add]:after:bg-emerald-500",
  "[&_.line.diff.remove]:bg-rose-50",
  "[&_.line.diff.remove]:after:bg-rose-500",
  "dark:[&_.line.diff.add]:bg-emerald-800",
  "dark:[&_.line.diff.remove]:bg-rose-800",
);

const lineFocusedClassNames = cn(
  "[&_code:has(.focused):not(:hover)_.line]:blur-[2px]",
  "[&_code:has(.focused):not(:hover)_.line.focused]:blur-none",
);

const wordHighlightClassNames = cn(
  "[&_.highlighted-word]:bg-blue-50",
  "dark:[&_.highlighted-word]:bg-blue-800",
);

const baseCodeBlockClassName = cn(
  "mt-0 text-sm",
  "[&_pre]:py-4",
  "[&_.shiki]:!bg-[var(--shiki-bg)]",
  "[&_code]:w-full",
  "[&_code]:grid",
  "[&_code]:overflow-x-auto",
  "[&_.line]:px-4",
  "[&_.line]:w-full",
  "[&_.line]:relative",
  lineHighlightClassNames,
  lineDiffClassNames,
  lineFocusedClassNames,
  wordHighlightClassNames,
  darkModeClassNames,
);

// Memoized transformers to avoid recreating on each render [^1]
const shikiTransformers = [
  transformerNotationDiff({
    matchAlgorithm: "v3",
  }),
  transformerNotationHighlight({
    matchAlgorithm: "v3",
  }),
  transformerNotationWordHighlight({
    matchAlgorithm: "v3",
  }),
  transformerNotationFocus({
    matchAlgorithm: "v3",
  }),
  transformerNotationErrorLevel({
    matchAlgorithm: "v3",
  }),
  transformerMetaHighlight({
    className: "highlighted",
  }),
];

// Default themes to avoid recreating on each render
const defaultThemes = {
  light: "vitesse-light",
  dark: "vitesse-dark",
};

type CodeBlockContextType = {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  value: undefined,
  onValueChange: undefined,
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

// Memoize the CodeBlock component to prevent unnecessary re-renders [^1]
export const CodeBlock = memo(
  ({
    value: controlledValue,
    onValueChange: controlledOnValueChange,
    defaultValue,
    className,
    ...props
  }: CodeBlockProps) => {
    const [value, onValueChange] = useControllableState({
      defaultProp: defaultValue ?? "",
      prop: controlledValue,
      onChange: controlledOnValueChange,
    });

    // Memoize the context value to prevent unnecessary re-renders [^1]
    const contextValue = useMemo(
      () => ({ value, onValueChange }),
      [value, onValueChange],
    );

    return (
      <CodeBlockContext.Provider value={contextValue}>
        <div
          className={cn(
            "overflow-hidden border shadow-sm transition-all hover:shadow-md",
            className,
          )}
          {...props}
        />
      </CodeBlockContext.Provider>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

export type CodeBlockHeaderProps = HTMLAttributes<HTMLDivElement>;

// Memoize the CodeBlockHeader component [^1]
export const CodeBlockHeader = memo(
  ({ className, ...props }: CodeBlockHeaderProps) => (
    <div
      className={cn(
        "flex flex-row items-center border-b bg-secondary p-1",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockHeader.displayName = "CodeBlockHeader";

export type CodeBlockFilenameProps = HTMLAttributes<HTMLDivElement> & {
  icon?: IconType;
  value?: string;
};

// Helper function to get icon for filename - moved outside component for better performance [^1]
const getIconForFilename = (
  filename: string,
  providedIcon?: IconType,
): IconType | undefined => {
  if (providedIcon) return providedIcon;

  return Object.entries(filenameIconMap).find(([pattern]) => {
    // Use cached regex pattern if available
    if (!filenamePatternCache.has(pattern)) {
      const regexPattern = `^${pattern.replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\*/g, ".*")}$`;
      filenamePatternCache.set(pattern, new RegExp(regexPattern));
    }
    return filenamePatternCache.get(pattern)!.test(filename);
  })?.[1];
};

// Memoize the CodeBlockFilename component [^1]
export const CodeBlockFilename = memo(
  ({ className, icon, value, children, ...props }: CodeBlockFilenameProps) => {
    const { value: activeValue } = useContext(CodeBlockContext);

    // Skip rendering if not active value
    const shouldRender = value === undefined || value === activeValue;

    if (!shouldRender) {
      return null;
    }

    const Icon = getIconForFilename(children as string, icon);

    return (
      <div
        className="flex grow items-center gap-2 bg-secondary px-4 py-1.5 text-muted-foreground text-xs"
        {...props}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <span className="flex-1 truncate">{children}</span>
      </div>
    );
  },
);
CodeBlockFilename.displayName = "CodeBlockFilename";

export type CodeBlockSelectProps = ComponentProps<typeof Select>;

// Memoize the CodeBlockSelect component [^1]
export const CodeBlockSelect = memo((props: CodeBlockSelectProps) => {
  const { value, onValueChange } = useContext(CodeBlockContext);

  return <Select value={value} onValueChange={onValueChange} {...props} />;
});
CodeBlockSelect.displayName = "CodeBlockSelect";

export type CodeBlockSelectTriggerProps = ComponentProps<typeof SelectTrigger>;

// Memoize the CodeBlockSelectTrigger component [^1]
export const CodeBlockSelectTrigger = memo(
  ({ className, ...props }: CodeBlockSelectTriggerProps) => (
    <SelectTrigger
      className={cn(
        "w-fit border-none text-muted-foreground text-xs shadow-none",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockSelectTrigger.displayName = "CodeBlockSelectTrigger";

export type CodeBlockSelectValueProps = ComponentProps<typeof SelectValue>;

// Memoize the CodeBlockSelectValue component [^1]
export const CodeBlockSelectValue = memo((props: CodeBlockSelectValueProps) => (
  <SelectValue {...props} />
));
CodeBlockSelectValue.displayName = "CodeBlockSelectValue";

export type CodeBlockSelectContentProps = ComponentProps<typeof SelectContent>;

// Memoize the CodeBlockSelectContent component [^1]
export const CodeBlockSelectContent = memo(
  (props: CodeBlockSelectContentProps) => <SelectContent {...props} />,
);
CodeBlockSelectContent.displayName = "CodeBlockSelectContent";

export type CodeBlockSelectItemProps = ComponentProps<typeof SelectItem>;

// Memoize the CodeBlockSelectItem component [^1]
export const CodeBlockSelectItem = memo(
  ({ className, ...props }: CodeBlockSelectItemProps) => (
    <SelectItem className={cn("text-sm", className)} {...props} />
  ),
);
CodeBlockSelectItem.displayName = "CodeBlockSelectItem";

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

// Memoize the CodeBlockCopyButton component [^1]
export const CodeBlockCopyButton = memo(
  ({
    asChild,
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: CodeBlockCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const { value } = useContext(CodeBlockContext);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Memoize the copyToClipboard function to prevent recreation on each render [^1]
    const copyToClipboard = useCallback(() => {
      if (
        typeof window === "undefined" ||
        !navigator.clipboard?.writeText ||
        !value
      ) {
        return;
      }

      navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);
        onCopy?.();

        // Clear existing timeout to prevent memory leaks
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
      }, onError);
    }, [value, onCopy, onError, timeout]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    if (asChild) {
      return cloneElement(children as ReactElement, {
        // @ts-expect-error - we know this is a button
        onClick: copyToClipboard,
      });
    }

    const Icon = isCopied ? CheckIcon : CopyIcon;

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className={cn("shrink-0", className)}
        {...props}
      >
        {children ?? <Icon size={14} className="text-muted-foreground" />}
      </Button>
    );
  },
);
CodeBlockCopyButton.displayName = "CodeBlockCopyButton";

type CodeBlockFallbackProps = HTMLAttributes<HTMLDivElement>;

// Memoize the CodeBlockFallback component [^1]
const CodeBlockFallback = memo(
  ({ children, ...props }: CodeBlockFallbackProps) => {
    // Memoize the lines to prevent recreation on each render
    const lines = useMemo(() => {
      return children
        ?.toString()
        .split("\n")
        .map((line, i) => (
          <span key={i} className="line">
            {line}
          </span>
        ));
    }, [children]);

    return (
      <div {...props}>
        <pre className="w-full">
          <code>{lines}</code>
        </pre>
      </div>
    );
  },
);
CodeBlockFallback.displayName = "CodeBlockFallback";

export type CodeBlockBodyProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  lineNumbers?: boolean;
  syntaxHighlighting?: boolean;
};

// Memoize the CodeBlockBody component [^1]
export const CodeBlockBody = memo(
  ({
    value,
    lineNumbers = true,
    syntaxHighlighting = true,
    children,
    className,
    ...props
  }: CodeBlockBodyProps) => {
    const { value: activeValue } = useContext(CodeBlockContext);

    // Skip rendering if not active value
    const shouldRender = value === undefined || value === activeValue;

    // Memoize the class names to prevent recreation on each render [^1]
    const codeBlockClassName = useMemo(() => {
      return cn(
        baseCodeBlockClassName,
        lineNumbers && lineNumberClassNames,
        className,
      );
    }, [className, lineNumbers]);

    if (!shouldRender) {
      return null;
    }

    if (!syntaxHighlighting) {
      return (
        <CodeBlockFallback className={codeBlockClassName} {...props}>
          {children}
        </CodeBlockFallback>
      );
    }

    return (
      <div className={codeBlockClassName} {...props}>
        {children}
      </div>
    );
  },
);
CodeBlockBody.displayName = "CodeBlockBody";

export type CodeBlockContentProps = {
  themes?: CodeOptionsMultipleThemes["themes"];
  language?: BundledLanguage;
  children: string;
  throttleMs?: number;
};

// Memoize the CodeBlockContent component [^1]
export const CodeBlockContent = memo(
  ({
    children,
    themes,
    language = "typescript",
    throttleMs = 50,
  }: CodeBlockContentProps) => {
    const [html, setHtml] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const prevPropsRef = useRef({ children, language, themes });
    const requestIdRef = useRef<number>(0);

    // Create a cache key for storing highlighted results
    const cacheKey = useMemo(() => {
      const themesKey = themes ? JSON.stringify(themes) : "default";
      return `${children}:${language}:${themesKey}`;
    }, [children, language, themes]);

    useEffect(() => {
      // Skip if nothing changed to avoid unnecessary work [^1]
      if (
        prevPropsRef.current.children === children &&
        prevPropsRef.current.language === language &&
        JSON.stringify(prevPropsRef.current.themes) === JSON.stringify(themes)
      ) {
        return;
      }

      // Update refs for future comparison
      prevPropsRef.current = { children, language, themes };

      // Check cache first
      if (highlightCache.has(cacheKey)) {
        setHtml(highlightCache.get(cacheKey)!);
        return;
      }

      setIsLoading(true);

      // Increment request ID to track the latest request
      const currentRequestId = ++requestIdRef.current;

      // Use requestAnimationFrame for better performance [^1]
      requestAnimationFrame(() => {
        // If this is no longer the latest request, abort
        if (currentRequestId !== requestIdRef.current) return;

        codeToHtml(children as string, {
          lang: language,
          themes: themes ?? defaultThemes,
          transformers: shikiTransformers,
        })
          .then((result) => {
            // If this is no longer the latest request, abort
            if (currentRequestId !== requestIdRef.current) return;

            // Store in cache for future use
            highlightCache.set(cacheKey, result);

            // Use setTimeout to throttle updates for better performance [^3][^4]
            setTimeout(() => {
              if (currentRequestId === requestIdRef.current) {
                setHtml(result);
                setIsLoading(false);
              }
            }, throttleMs);
          })
          .catch((error) => {
            console.error("Error highlighting code:", error);
            setIsLoading(false);
          });
      });

      // Cleanup function
      return () => {
        // If cache gets too large, clean it up
        if (highlightCache.size > 100) {
          const keys = Array.from(highlightCache.keys());
          for (let i = 0; i < keys.length - 50; i++) {
            highlightCache.delete(keys[i]);
          }
        }
      };
    }, [cacheKey, children, language, themes, throttleMs]);

    if (isLoading || !html) {
      return <CodeBlockFallback>{children}</CodeBlockFallback>;
    }

    return (
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: "Kinda how Shiki works"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },
);
CodeBlockContent.displayName = "CodeBlockContent";
