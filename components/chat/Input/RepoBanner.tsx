"use client";

import { useState } from "react";

import { memo } from "react";
import { Settings, Search, PenToolIcon as Tool, Globe } from "lucide-react";
import DeepSeek from "@/components/icons/deepseek";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "motion/react";
import { useAgentStore } from "@/store/useAgentStore";

interface RepoBannerProps {
  className?: string;
  onSearchToggle?: (enabled: boolean) => void;
  onToolSelect?: (tool: string) => void;
  initialSearchEnabled?: boolean;
}

function PureRepoBanner({
  className,
  onSearchToggle,
  onToolSelect,
  initialSearchEnabled = false,
}: RepoBannerProps) {
  const handleSearchToggle = (checked: boolean) => {
    onSearchToggle?.(checked);
  };

  const handleToolSelect = (tool: string) => {
    onToolSelect?.(tool);
  };

  const setSearchEanabled = useAgentStore((state) => state.setIsSearchEnabled);

  const [showSearch, setShowSearch] = useState(initialSearchEnabled);

  return (
    <div
      className={cn(
        "relative rounded-small border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/10 overflow-hidden px-0 py-1",
        "gap-2 flex items-center justify-between border border-b-0",
        className,
      )}
    >
      <div className="flex items-center gap-2 pl-2">
        <DeepSeek className="w-4 h-4" aria-hidden="true" />
        <Separator
          orientation="vertical"
          className="h-6 bg-[hsl(var(--border))]"
          aria-hidden="true"
        />

        {/* Search Toggle */}
        <button
          type="button"
          onClick={() => {
            setSearchEanabled(!showSearch);
            setShowSearch(!showSearch);
          }}
          className={cn(
            " transition-all flex items-center gap-2 px-1.5 py-1 border h-8 cursor-pointer",
            showSearch
              ? "bg-sky-500/15 border-sky-400 text-sky-500"
              : "bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white ",
          )}
        >
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            <motion.div
              animate={{
                rotate: showSearch ? 180 : 0,
                scale: showSearch ? 1.1 : 1,
              }}
              whileHover={{
                rotate: showSearch ? 180 : 15,
                scale: 1.1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
            >
              <Globe
                className={cn(
                  "w-4 h-4",
                  showSearch ? "text-sky-500" : "text-inherit",
                )}
              />
            </motion.div>
          </div>
          <AnimatePresence>
            {showSearch && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: "auto",
                  opacity: 1,
                }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm overflow-hidden whitespace-nowrap text-sky-500 shrink-0"
              >
                Search
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Tools Options on end */}
      <div className="flex items-center gap-2 pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Tool className="h-4 w-4" />
              <span className="sr-only">Select tools</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Available Tools</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleToolSelect("code-analyzer")}>
              Code Analyzer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToolSelect("document-generator")}
            >
              Document Generator
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToolSelect("dependency-checker")}
            >
              Dependency Checker
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToolSelect("performance-profiler")}
            >
              Performance Profiler
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
}

// Define the custom comparison function for memoization
const arePropsEqual = (
  prevProps: RepoBannerProps,
  nextProps: RepoBannerProps,
): boolean => {
  // Compare className
  if (prevProps.className !== nextProps.className) return false;

  // Compare callback functions by reference
  if (prevProps.onSearchToggle !== nextProps.onSearchToggle) return false;
  if (prevProps.onToolSelect !== nextProps.onToolSelect) return false;

  // Compare initialSearchEnabled
  if (prevProps.initialSearchEnabled !== nextProps.initialSearchEnabled)
    return false;

  // If none of the props changed, return true to prevent re-render
  return true;
};

// Create the memoized component
export const RepoBanner = memo(PureRepoBanner, arePropsEqual);
