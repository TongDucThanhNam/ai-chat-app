"use client";

import { Loader } from "@/components/ui/loader";
import { memo } from "react";
import { cn } from "@/lib/utils";
import equal from "fast-deep-equal";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";

interface StepStartPartProps {
  messageId: string;
  index: number;
  isGenerating: boolean;
}

function PureStepStartPart({
  messageId,
  index,
  isGenerating,
}: StepStartPartProps) {
  // If generating, show loader
  if (isGenerating) {
    return (
      <div>
        <TextShimmerWave className="font-mono text-sm" duration={1}>
          Generating code...
        </TextShimmerWave>
      </div>
    );
  }

  // Only show divider if not the first step
  return index > 0 ? (
    <div className={cn("text-gray-500")}>
      <hr className="my-2 border-gray-300" />
    </div>
  ) : null;
}

// Proper comparison function that checks relevant props
const arePropsEqual = (
  prevProps: StepStartPartProps,
  nextProps: StepStartPartProps,
): boolean => {
  // Only re-render if isGenerating or index changes
  if (!equal(prevProps.isGenerating, nextProps.isGenerating)) return false;
  if (!equal(prevProps.index, nextProps.index)) return false;

  // messageId doesn't affect rendering, so we don't need to compare it
  return true;
};

const StepStartPart = memo(PureStepStartPart, arePropsEqual);
StepStartPart.displayName = "StepStartPart";

export default StepStartPart;
