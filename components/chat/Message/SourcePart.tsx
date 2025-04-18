"use client";

import { memo } from "react";
import type { SourceUIPart } from "@ai-sdk/ui-utils";
import equal from "fast-deep-equal";

interface SourcePartProps {
  part: SourceUIPart;
  messageId: string;
  index: number;
}

function PureSourcePart({ part, messageId, index }: SourcePartProps) {
  const key = `message-${messageId}-part-${index}`;
  const { source } = part;
  const { sourceType, id, url, title } = source;

  return (
    <div key={key} className="mb-2">
      <div className="text-sm text-gray-500">
        {sourceType} - {id}
      </div>
      <div className="text-sm text-gray-500">{url}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

// Custom comparison function
const arePropsEqual = (
  prevProps: SourcePartProps,
  nextProps: SourcePartProps,
): boolean => {
  // Deep compare the source object
  return equal(prevProps.part.source, nextProps.part.source);
};

const SourcePart = memo(PureSourcePart, arePropsEqual);
SourcePart.displayName = "SourcePart";

export default SourcePart;
