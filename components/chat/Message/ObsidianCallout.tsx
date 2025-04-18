"use client";

import React from "react";
import { CalloutType } from "@/components/ui/callout";
import { NotebookCallout } from "@/components/chat/Message/notebook-callout";

interface NodeChild {
  type: string;
  tagName?: string;
  children?: Array<{ type: string; value: string }>;
}

interface ObsidianCalloutProps {
  children?: React.ReactNode;
  props: {
    node: { children: NodeChild[] };
  };
}

export default function ObsidianCallout({
  children,
  props,
}: ObsidianCalloutProps) {
  const pChild = props.node.children.find(
    (child) => child.type === "element" && child.tagName === "p",
  );

  let type: CalloutType = "quote";

  if (pChild && Array.isArray(pChild.children)) {
    const firstChild = pChild.children[0];
    if (firstChild?.type === "text") {
      const match = firstChild.value.match(/\[!(.*?)\]/);
      if (match?.[1]) {
        type = match[1] as CalloutType;
      } else {
        type = "quote";
      }
    }
  }
  type = type.toLowerCase() as CalloutType;

  return (
    <div className="flex flex-col">
      {" "}
      <NotebookCallout type={type}>{children}</NotebookCallout>
    </div>
  );
}
