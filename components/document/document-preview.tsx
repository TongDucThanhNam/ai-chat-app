"use client";

import type React from "react";
import {
  memo,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import equal from "fast-deep-equal";
import useSWR from "swr";

import type { ArtifactKind, UIArtifact } from "@/components/artifact/artifact";
import {
  FileIcon,
  FullscreenIcon,
  ImageIcon,
  LoaderIcon,
} from "@/components/icons/icons";
import { cn, fetcher } from "@/lib/utils";
import type { Document } from "@/lib/db/schema";
import { InlineDocumentSkeleton } from "./document-skeleton";
import { DocumentToolCall, DocumentToolResult } from "./document";
import { useArtifact } from "@/hooks/use-artifact";
import { ImageEditor } from "@/components/artifact/image/image-editor";

// Define prop interfaces for each component
interface DocumentPreviewProps {
  isReadonly: boolean;
  result?: any;
  args?: any;
}

interface HitboxLayerProps {
  hitboxRef: React.MutableRefObject<HTMLDivElement | null>;
  result: any;
  setArtifact: (
    updater: UIArtifact | ((current: UIArtifact) => UIArtifact),
  ) => void;
}

interface DocumentHeaderProps {
  title: string;
  kind: ArtifactKind;
  isStreaming: boolean;
}

interface DocumentContentProps {
  document: Document;
}

interface LoadingSkeletonProps {
  artifactKind: ArtifactKind;
}

// Main component
function DocumentPreviewComponent({
  isReadonly,
  result,
  args,
}: DocumentPreviewProps) {
  const { artifact, setArtifact } = useArtifact();
  const hitboxRef = useRef<HTMLDivElement>(null);

  const { data: documents, isLoading: isDocumentsFetching } = useSWR<
    Array<Document>
  >(result ? `/api/document?id=${result.id}` : null, fetcher);

  const previewDocument = useMemo(() => documents?.[0], [documents]);

  useEffect(() => {
    const boundingBox = hitboxRef.current?.getBoundingClientRect();

    if (artifact.documentId && boundingBox) {
      setArtifact((current) => ({
        ...current,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    }
  }, [artifact.documentId, setArtifact]);

  if (artifact.isVisible) {
    if (result) {
      return (
        <DocumentToolResult
          type="create"
          result={{ id: result.id, title: result.title, kind: result.kind }}
          isReadonly={isReadonly}
        />
      );
    }

    if (args) {
      return (
        <DocumentToolCall
          type="create"
          args={{ title: args.title }}
          isReadonly={isReadonly}
        />
      );
    }
  }

  if (isDocumentsFetching) {
    return <LoadingSkeleton artifactKind={result?.kind || args?.kind} />;
  }

  const document: Document | null = previewDocument
    ? previewDocument
    : artifact.status === "streaming"
      ? {
          title: artifact.title,
          kind: artifact.kind,
          content: artifact.content,
          id: artifact.documentId,
          createdAt: new Date(),
          userId: "noop",
        }
      : null;

  if (!document) return <LoadingSkeleton artifactKind={artifact.kind} />;

  return (
    <div className="relative w-full cursor-pointer">
      <HitboxLayer
        hitboxRef={hitboxRef}
        result={result}
        setArtifact={setArtifact}
      />
      <DocumentHeader
        title={document.title}
        kind={document.kind}
        isStreaming={artifact.status === "streaming"}
      />
      <DocumentContent document={document} />
    </div>
  );
}

// Optimized sub-components with memoization
const PureLoadingSkeleton = ({ artifactKind }: LoadingSkeletonProps) => (
  <div className="w-full">
    <div className="p-4 border flex flex-row gap-2 items-center justify-between dark:bg-muted h-[57px] dark:border-zinc-700 border-b-0">
      <div className="flex flex-row items-center gap-3">
        <div className="text-muted-foreground">
          <div className="animate-pulse size-4 bg-muted-foreground/20" />
        </div>
        <div className="animate-pulse h-4 bg-muted-foreground/20 w-24" />
      </div>
      <div>
        <FullscreenIcon />
      </div>
    </div>
    {artifactKind === "image" ? (
      <div className="overflow-y-scroll border bg-muted border-t-0 dark:border-zinc-700">
        <div className="animate-pulse h-[257px] bg-muted-foreground/20 w-full" />
      </div>
    ) : (
      <div className="overflow-y-scroll border p-8 pt-4 bg-muted border-t-0 dark:border-zinc-700">
        <InlineDocumentSkeleton />
      </div>
    )}
  </div>
);

const LoadingSkeleton = memo(PureLoadingSkeleton, (prevProps, nextProps) => {
  return prevProps.artifactKind === nextProps.artifactKind;
});

const PureHitboxLayer = ({
  hitboxRef,
  result,
  setArtifact,
}: HitboxLayerProps) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const boundingBox = event.currentTarget.getBoundingClientRect();

      setArtifact((artifact) =>
        artifact.status === "streaming"
          ? { ...artifact, isVisible: true }
          : {
              ...artifact,
              title: result?.title,
              documentId: result?.id,
              kind: result?.kind,
              isVisible: true,
              boundingBox: {
                left: boundingBox.x,
                top: boundingBox.y,
                width: boundingBox.width,
                height: boundingBox.height,
              },
            },
      );
    },
    [setArtifact, result],
  );

  return (
    <div
      className="size-full absolute top-0 left-0 z-10"
      ref={hitboxRef}
      onClick={handleClick}
      role="presentation"
      aria-hidden="true"
    >
      <div className="w-full p-4 flex justify-end items-center">
        <div className="absolute right-[9px] top-[13px] p-2 hover:dark:bg-zinc- hover:bg-zinc-100">
          <FullscreenIcon />
        </div>
      </div>
    </div>
  );
};

const HitboxLayer = memo(PureHitboxLayer, (prevProps, nextProps) => {
  return equal(prevProps.result, nextProps.result);
});

const PureDocumentHeader = ({
  title,
  kind,
  isStreaming,
}: DocumentHeaderProps) => (
  <div className="p-4 border flex flex-row gap-2 items-start sm:items-center justify-between dark:bg-muted border-b-0 dark:border-zinc-700">
    <div className="flex flex-row items-start sm:items-center gap-3">
      <div className="text-muted-foreground">
        {isStreaming ? (
          <div className="animate-spin">
            <LoaderIcon />
          </div>
        ) : kind === "image" ? (
          <ImageIcon />
        ) : (
          <FileIcon />
        )}
      </div>
      <div className="-translate-y-1 sm:translate-y-0 font-medium">{title}</div>
    </div>
    <div className="w-8" />
  </div>
);

const DocumentHeader = memo(PureDocumentHeader, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;
  if (prevProps.kind !== nextProps.kind) return false;
  if (prevProps.isStreaming !== nextProps.isStreaming) return false;
  return true;
});

const PureDocumentContent = ({ document }: DocumentContentProps) => {
  const { artifact } = useArtifact();

  const containerClassName = cn("h-full overflow-hidden");

  const commonProps = useMemo(
    () => ({
      content: document.content ?? "",
      isCurrentVersion: true,
      currentVersionIndex: 0,
      status: artifact.status,
      saveContent: () => {},
      suggestions: [],
    }),
    [document.content, artifact.status],
  );

  return (
    <div className={containerClassName}>
      {document.kind === "image" && (
        <ImageEditor
          title={document.title}
          content={document.content ?? ""}
          isCurrentVersion={true}
          currentVersionIndex={0}
          status={artifact.status}
          isInline={true}
        />
      )}
    </div>
  );
};

const DocumentContent = memo(PureDocumentContent, (prevProps, nextProps) => {
  if (!equal(prevProps.document, nextProps.document)) return false;
  return true;
});

// Export the memoized component
export const DocumentPreview = memo(
  DocumentPreviewComponent,
  (prevProps, nextProps) => {
    if (prevProps.isReadonly !== nextProps.isReadonly) return false;
    if (!equal(prevProps.result, nextProps.result)) return false;
    if (!equal(prevProps.args, nextProps.args)) return false;
    return true;
  },
);
