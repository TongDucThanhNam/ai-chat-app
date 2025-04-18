"use client";

import { memo, useCallback, useState, useMemo, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { Loader } from "@/components/ui/loader";

interface ReasoningMessageProps {
  initialSeconds?: number;
  message?: string;
  onComplete?: () => void;
  isDone?: boolean;
}

function ReasoningMessage({
  message = "",
  onComplete,
  initialSeconds,
  isDone = false,
}: ReasoningMessageProps) {
  const [expanded, setExpanded] = useState(false);

  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Call onComplete when component unmounts or when specified by logic
  useEffect(() => {
    if (initialSeconds && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, initialSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [initialSeconds, onComplete]);

  // Memoize the styles for the gradient mask to prevent recalculation on re-renders
  const gradientMaskStyle = useMemo(
    () => ({
      maskImage:
        "linear-gradient(to top, transparent 0%, #000 55%, #000 45%, transparent 100%)",
    }),
    [],
  );

  // Memoize the chevron classes to prevent string concatenation on every render
  const chevronClasses = useMemo(
    () =>
      `h-6 w-6 transition-transform duration-200 ${expanded ? "" : "transform rotate-180"}`,
    [expanded],
  );

  return (
    <Card className="w-full max-w-3xl border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Loader
              className={"text-black"}
              variant={"loading-dots"}
              size={"lg"}
            />
            {/*<span className="font-medium text-xl text-gray-800">Thinking</span>*/}
          </div>
          <button
            onClick={toggleExpanded}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={chevronClasses} />
          </button>
        </div>

        <motion.div
          className={`w-full h-[150px] overflow-y-hidden ${expanded || isDone ? "hidden" : "block"}`}
          style={gradientMaskStyle}
        >
          <motion.div
            className="w-full h-full flex flex-col-reverse overflow-hidden"
            layout
            transition={{
              type: "spring",
              stiffness: 120, // Giảm stiffness để animation mềm mại hơn
              damping: 25, // Điều chỉnh damping để có độ nảy vừa phải
              mass: 0.8, // Thêm mass để tạo cảm giác tự nhiên hơn
              velocity: 2, // Thêm velocity để animation bắt đầu nhanh hơn
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} // Thêm exit animation
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1], // Cubic bezier curve cho chuyển động mượt mà
                staggerChildren: 0.05, // Hiệu ứng stagger cho các phần tử con
                delayChildren: 0.1, // Delay nhỏ trước khi các phần tử con animate
              }}
            >
              {message}
            </motion.div>
          </motion.div>
        </motion.div>

        {expanded && <p>{message}</p>}
      </CardContent>
    </Card>
  );
}

// Memoize the entire component to prevent unnecessary re-renders
export default memo(ReasoningMessage);
