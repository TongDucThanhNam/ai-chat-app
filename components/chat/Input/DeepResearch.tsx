"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Check, Loader2, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Define the research stages
const researchStages = [
  { id: "thinking", label: "Thinking" },
  { id: "exploring", label: "Exploring AI toolSchema" },
  { id: "evaluating", label: "Evaluating free tiers" },
  { id: "comparing", label: "Comparing tool lists" },
  { id: "finalizing", label: "Finalizing tool list" },
  { id: "verifying", label: "Verifying free tiers" },
  { id: "confirming", label: "Confirming free versions" },
];

// Define the research content for each stage
const researchContent = {
  thinking: [
    "Analyzing the query about AI toolSchema with free tiers.",
    "Preparing to gather information about available options.",
  ],
  exploring: [
    "Searching for popular AI toolSchema across different categories.",
    "Identifying toolSchema with free tier offerings.",
    "Creating an initial list of potential toolSchema to evaluate.",
  ],
  evaluating: [
    "Checking which toolSchema offer free tiers or free versions.",
    "Examining limitations of free offerings.",
    "Noting usage restrictions like time limits or feature limitations.",
  ],
  comparing: [
    "Cross-referencing multiple tool lists to ensure comprehensive coverage.",
    "Removing duplicate entries from the combined lists.",
    "Organizing toolSchema by category and functionality.",
  ],
  finalizing: [
    "Selecting the most relevant toolSchema with valuable free tiers.",
    "Prioritizing toolSchema based on feature availability in free versions.",
    "Creating the final curated list of 20 toolSchema.",
  ],
  verifying: [
    "Double-checking that all listed toolSchema still offer free tiers.",
    "Verifying the current limitations and restrictions.",
    "Ensuring information is up-to-date with recent changes.",
  ],
  confirming: [
    "All toolSchema in my list have free tiers, even if limited, like Synthesia's 36 minutes per year.",
    "I noticed DALL-E 3 appeared twice in my earlier list, which was a mistake. I'm fixing that now.",
    "The corrected list has 20 unique toolSchema, ensuring no duplicates like DALL-E 3.",
    "I'm citing sources like Zapier, Synthesia, Retable, TopAI.toolSchema, and Cyberlink to back up my list.",
    "Wait, but I need to make sure that these sources are accurate and up-to-date.",
    "The final list includes toolSchema like Asana, Canva Magic Studio, and Character.AI, all verified for free tiers.",
    "Clockwise has a free basic features tier, but I'm checking if it's sufficient for general use.",
  ],
};

// Memoized stage component to prevent unnecessary re-renders
const StageItem = memo(
  ({
    stage,
    index,
    currentStage,
    isComplete,
  }: {
    stage: (typeof researchStages)[0];
    index: number;
    currentStage: number;
    isComplete: boolean;
  }) => {
    return (
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex items-center gap-2 py-1",
          index === currentStage && !isComplete
            ? "text-primary font-medium"
            : "",
          index < currentStage || (index === currentStage && isComplete)
            ? "text-muted-foreground"
            : "text-muted-foreground/50",
        )}
      >
        <motion.div
          className="w-6 h-6 flex items-center justify-center"
          animate={{ scale: index === currentStage ? [1, 1.1, 1] : 1 }}
          transition={{
            repeat: index === currentStage ? Number.POSITIVE_INFINITY : 0,
            duration: 2,
          }}
        >
          {index < currentStage || (index === currentStage && isComplete) ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
          ) : index === currentStage ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          )}
        </motion.div>
        <span>{stage.label}</span>
      </motion.div>
    );
  },
);
StageItem.displayName = "StageItem";

// Memoized content item to prevent unnecessary re-renders
const ContentItem = memo(
  ({ content, index }: { content: string; index: number }) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <div className="flex items-start">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mr-2"
          >
            •
          </motion.span>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {content}
          </motion.p>
        </div>
      </motion.div>
    );
  },
);
ContentItem.displayName = "ContentItem";

export function DeepResearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [displayedContent, setDisplayedContent] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleStages, setVisibleStages] = useState<number[]>([0]);

  const contentAreaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format timer display - memoized to prevent recalculation
  const formattedTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStage(0);
      setDisplayedContent([]);
      setTimer(0);
      setIsComplete(false);
      setVisibleStages([0]);

      // Start the timer
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isOpen]);

  // Progress through stages - optimized to reduce unnecessary work
  useEffect(() => {
    if (!isOpen || isComplete) return;

    const cleanupTimeouts = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (currentStage < researchStages.length) {
      const stageContent =
        researchContent[
          researchStages[currentStage].id as keyof typeof researchContent
        ];
      let contentIndex = 0;

      const showContent = () => {
        if (contentIndex < stageContent.length) {
          setDisplayedContent((prev) => [...prev, stageContent[contentIndex]]);
          contentIndex++;
          timeoutRef.current = setTimeout(
            showContent,
            1000 + Math.random() * 1000,
          );
        } else {
          // Move to next stage after a delay
          timeoutRef.current = setTimeout(() => {
            if (currentStage < researchStages.length - 1) {
              const nextStage = currentStage + 1;
              setCurrentStage(nextStage);

              // Update visible stages to include the next stage - optimized to reduce calculations
              setVisibleStages((prev) => {
                if (
                  prev.includes(nextStage) &&
                  (nextStage + 1 >= researchStages.length ||
                    prev.includes(nextStage + 1))
                ) {
                  return prev; // No change needed
                }

                const newVisible = [...prev];
                if (!newVisible.includes(nextStage)) {
                  newVisible.push(nextStage);
                }
                // Optionally show one stage ahead for context
                if (
                  nextStage + 1 < researchStages.length &&
                  !newVisible.includes(nextStage + 1)
                ) {
                  newVisible.push(nextStage + 1);
                }
                return newVisible;
              });
            } else {
              setIsComplete(true);
            }
          }, 2000);
        }
      };

      timeoutRef.current = setTimeout(showContent, 1000);
    }

    return cleanupTimeouts;
  }, [currentStage, isOpen, isComplete]);

  // Auto-scroll when displayedContent changes - optimized with requestAnimationFrame
  useEffect(() => {
    if (displayedContent.length > 0 && contentAreaRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        if (contentAreaRef.current) {
          contentAreaRef.current.scrollTop =
            contentAreaRef.current.scrollHeight;
        }
      });
    }
  }, [displayedContent]);

  // Memoize the formatted time to prevent unnecessary calculations
  const displayTime = useCallback(
    () => formattedTime(timer),
    [timer, formattedTime],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border shadow-sm">
          Start DeepResearch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-medium">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg"
            >
              DeepResearch
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              {displayTime()}
            </motion.span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[200px_1fr] gap-6 mt-4 max-h-[calc(80vh-100px)] overflow-hidden">
          {/* Progress indicator */}
          <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin">
            <AnimatePresence>
              {visibleStages.map((stageIndex) => (
                <StageItem
                  key={researchStages[stageIndex].id}
                  stage={researchStages[stageIndex]}
                  index={stageIndex}
                  currentStage={currentStage}
                  isComplete={isComplete}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Content area */}
          <div
            ref={contentAreaRef}
            className="overflow-y-auto pr-2 scrollbar-thin"
          >
            <AnimatePresence>
              {displayedContent.map((content, index) => (
                <ContentItem key={index} content={content} index={index} />
              ))}
            </AnimatePresence>

            {!isComplete && currentStage === researchStages.length - 1 && (
              <motion.div
                className="flex justify-end mt-4"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
