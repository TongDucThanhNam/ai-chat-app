import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
} from "@/components/ui/kibo-ui/code-block";
import { cn } from "@/lib/utils";
import type { BundledLanguage } from "shiki";
import { memo, useCallback } from "react";

const extractLanguage = (className?: string): BundledLanguage => {
  if (!className) return "tex";
  const match = className.match(/language-(\w+)/);
  return (match ? match[1] : "") as BundledLanguage;
};

const copyWithoutSpecialComments = (code: string): string => {
  return code
    .split("\n")
    .filter((line) => !line.includes("// [!code --]"))
    .join("\n");
};

const InlineCode = memo(({ className, children, ...props }: any) => (
  <span
    className={cn(
      "bg-primary-foreground rounded-sm px-1 font-mono text-sm",
      className,
    )}
    {...props}
  >
    {children}
  </span>
));

InlineCode.displayName = "InlineCode";

const BlockCode = memo(({ className, children, node, ...props }: any) => {
  const language = extractLanguage(className);
  const fileName =
    node?.data?.meta?.match(/title="([^"]*)"/)?.at(1) ?? `code.${language}`;

  const handleCopy = useCallback(() => {
    const cleanedCode = copyWithoutSpecialComments(children as string);
    window.navigator.clipboard.writeText(cleanedCode);
  }, [children]);

  const handleCopyError = useCallback(() => {
    console.error("Failed to copy to clipboard");
  }, []);

  return (
    <div className="p-4">
      <CodeBlock defaultValue={language}>
        <CodeBlockHeader>
          <CodeBlockFilename value={language}>{fileName}</CodeBlockFilename>
          <CodeBlockCopyButton onCopy={handleCopy} onError={handleCopyError} />
        </CodeBlockHeader>
        <CodeBlockBody value={language}>
          <CodeBlockContent
            language={language}
            themes={{
              light: "one-light",
              dark: "one-dark-pro",
            }}
          >
            {children as string}
          </CodeBlockContent>
        </CodeBlockBody>
      </CodeBlock>
    </div>
  );
});

BlockCode.displayName = "BlockCode";

export const CodeComponent = memo(
  ({ className, children, node, ...props }: any) => {
    const isInline =
      !node?.position?.start.line ||
      node?.position?.start.line === node?.position?.end.line;

    return isInline ? (
      <InlineCode className={className} {...props}>
        {children}
      </InlineCode>
    ) : (
      <BlockCode className={className} node={node} {...props}>
        {children}
      </BlockCode>
    );
  },
);

CodeComponent.displayName = "CodeComponent";
