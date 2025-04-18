"use client";

import { memo } from "react";
import ResoningMessage from "@/components/chat/Message/ResoningMessage";
import type { ReasoningUIPart } from "@ai-sdk/ui-utils";

interface ReasoningPartProps {
  part: ReasoningUIPart;
  messageId: string;
  index: number;
  status: "submitted" | "streaming" | "ready" | "error";
}

function PureReasoningPart({
  part,
  messageId,
  index,
  status,
}: ReasoningPartProps) {
  const key = `message-${messageId}-part-${index}`;
  const { reasoning } = part;

  return (
    <div key={key} className="mb-2">
      <ResoningMessage
        initialSeconds={6}
        isDone={status === "ready"}
        message={reasoning}
        onComplete={() => {
          console.log("Reasoning completed");
        }}
      />
    </div>
  );
}

// Custom comparison function
const arePropsEqual = (
  prevProps: ReasoningPartProps,
  nextProps: ReasoningPartProps,
): boolean => {
  // Only re-render if reasoning content changes or status changes
  if (prevProps.part.reasoning !== nextProps.part.reasoning) return false;
  if (prevProps.status !== nextProps.status) return false;
  return true;
};

const ReasoningPart = memo(PureReasoningPart, arePropsEqual);
ReasoningPart.displayName = "ReasoningPart";

export default ReasoningPart;
