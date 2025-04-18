"use client";

import type { SearchResults as TypeSearchResults } from "@/types";
import { ToolInvocation } from "ai";
import { useChat } from "ai/react";
import { CollapsibleMessage } from "./collapsible-message";
import { SearchSkeleton } from "./default-skeleton";
import { SearchResults } from "./search-results";
import { SearchResultsImageSection } from "./search-results-image";
import { Section, ToolArgsSection } from "./section";

interface SearchSectionProps {
  tool: ToolInvocation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status: "submitted" | "streaming" | "ready" | "error";
}

export function SearchSection({
  tool,
  isOpen,
  onOpenChange,
  status,
}: SearchSectionProps) {
  const isToolLoading = tool.state === "call";
  const searchResults: TypeSearchResults =
    tool.state === "result" ? tool.result : undefined;
  const query = tool.args?.query as string | undefined;
  const includeDomains = tool.args?.includeDomains as string[] | undefined;
  const includeDomainsString = includeDomains
    ? ` [${includeDomains.join(", ")}]`
    : "";

  const header = (
    <ToolArgsSection
      tool="search"
      number={searchResults?.results?.length}
    >{`${query}${includeDomainsString}`}</ToolArgsSection>
  );

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {searchResults &&
        searchResults.images &&
        searchResults.images.length > 0 && (
          <Section>
            <SearchResultsImageSection
              images={searchResults.images}
              query={query}
            />
          </Section>
        )}
      {status === "streaming" && isToolLoading ? (
        <SearchSkeleton />
      ) : searchResults?.results ? (
        <Section title="Sources">
          <SearchResults results={searchResults.results} />
        </Section>
      ) : null}
    </CollapsibleMessage>
  );
}
