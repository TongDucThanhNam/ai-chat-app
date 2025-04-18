"use client";

import * as React from "react";
import { Fragment, memo, useCallback, useState } from "react";
import { ChevronsUpDown, MoreHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandGroupHeader } from "./CommandGroupHeader";
import { AnimatePresence } from "framer-motion";
import * as motion from "motion/react-client";
import { ProviderIcon } from "./ProviderIcon";
import { AnimatedListItem } from "@/components/chat/Input/AnimatedListItem";
import { Agent, ModelProvider } from "@/types";
import { codePrompt, obsidianPrompt } from "@/lib/ai/prompts";
import { availableAgents } from "@/lib/ai/agents";
import { useAgentStore } from "@/store/useAgentStore";

// Memoize animation variants
const popoverVariants = {
  hidden: { opacity: 0, y: -5, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

// Memoize filtered agent lists
const activeAgents = availableAgents.filter((agent) => agent.model.active);
const pinnedAgents = availableAgents.filter((agent) => agent.model.pinned);

// Group by provider
const allAgentsByProvider = availableAgents.reduce(
  (acc: Map<string, Agent[]>, agent) => {
    if (!acc.has(agent.model.provider)) {
      acc.set(agent.model.provider, []);
    }
    acc.get(agent.model.provider)!.push(agent);
    return acc;
  },
  new Map<string, Agent[]>(),
);

// Memoize booleans for conditional rendering
const hasActiveAgents = activeAgents.length > 0;
const hasPinnedAgents = pinnedAgents.length > 0;

// Memoize handler functions
const handleActiveSettingsClick = () => console.log("Active settings clicked");
const handlePinnedOptionsClick = () => console.log("Pinned options clicked");

// Create memoized child components
const SelectedAgentDisplay = memo(function SelectedAgentDisplay({
  agent,
}: {
  agent: Agent;
}) {
  return (
    <div className="flex items-center gap-2 max-w-[90%]">
      <ProviderIcon provider={agent.model.provider as ModelProvider} />
      <span className="truncate" title={agent.model.name}>
        {agent.model.name}
      </span>
    </div>
  );
});

const CommandInputWrapper = memo(function CommandInputWrapper() {
  return (
    <motion.div
      className="flex items-center border-b px-3"
      style={{ "--command-input-height": "40px" } as React.CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05, duration: 0.2 }}
    >
      <CommandInput
        placeholder="Search agentSchema..."
        className="border-0 focus:ring-0"
      />
    </motion.div>
  );
});

const CommandFooter = memo(function CommandFooter({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <motion.div
      className="border-t sticky bottom-0 bg-white dark:bg-slate-900/80 z-10"
      style={{ "--command-footer-height": "41px" } as React.CSSProperties}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <motion.div
        className="flex items-center justify-center py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        onClick={onClose}
      >
        Create New Agent...
      </motion.div>
    </motion.div>
  );
});

// Memoize group headings
const ActiveGroupHeading = memo(function ActiveGroupHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      <CommandGroupHeader
        label="ACTIVE AGENTS"
        icon={Settings}
        onIconClick={handleActiveSettingsClick}
      />
    </motion.div>
  );
});

const PinnedGroupHeading = memo(function PinnedGroupHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.2 }}
    >
      <CommandGroupHeader
        label="PINNED AGENTS"
        icon={MoreHorizontal}
        onIconClick={handlePinnedOptionsClick}
      />
    </motion.div>
  );
});

const ProviderGroupHeading = memo(function ProviderGroupHeading({
  provider,
}: {
  provider: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.2 }}
    >
      <CommandGroupHeader label={provider.toUpperCase()} />
    </motion.div>
  );
});

interface AgentSelectorProps {}

// Main component
export default function AgentSelector({}: AgentSelectorProps) {
  const selectedAgent = useAgentStore((state) => state.selectedAgent);
  const setSelectedAgent = useAgentStore((state) => state.setSelectedAgent);
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  const handleSelectAgent = useCallback(
    (agent: Agent) => {
      setSelectedAgent(agent);
      setOpen(false);
    },
    [setSelectedAgent],
  );

  const handleHoverChange = useCallback((id: string | null) => {
    setHoveredItem(id);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Render agent lists
  const renderActiveAgents = useCallback(() => {
    return activeAgents.map((agent, index) => (
      <AnimatedListItem
        key={agent.model.id}
        model={agent.model}
        onSelect={() => handleSelectAgent(agent)}
        showDownloadIcon={hoveredItem === agent.model.id}
        isActive
        onHover={handleHoverChange}
        index={index}
      />
    ));
  }, [hoveredItem, handleHoverChange, handleSelectAgent]);

  const renderPinnedAgents = useCallback(() => {
    return pinnedAgents.map((agent, index) => (
      <AnimatedListItem
        key={`pinned-${agent.model.id}`}
        model={agent.model}
        onSelect={() => handleSelectAgent(agent)}
        showDownloadIcon={hoveredItem === agent.model.id}
        isPinned
        onHover={handleHoverChange}
        index={index + 2}
      />
    ));
  }, [hoveredItem, handleHoverChange, handleSelectAgent]);

  const renderProviderAgents = useCallback(
    (provider: string, agentList: Agent[]) => {
      return agentList.map((agent, index) => (
        <AnimatedListItem
          key={agent.model.id}
          model={agent.model}
          onSelect={() => handleSelectAgent(agent)}
          showDownloadIcon={hoveredItem === agent.model.id}
          onHover={handleHoverChange}
          index={index + 4}
        />
      ));
    },
    [hoveredItem, handleHoverChange, handleSelectAgent],
  );

  return (
    <Fragment>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileTap="tap"
          >
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[250px] justify-between transition-all duration-200"
            >
              <SelectedAgentDisplay agent={selectedAgent} />
              <motion.div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </motion.div>
            </Button>
          </motion.div>
        </PopoverTrigger>

        <AnimatePresence>
          {open && (
            <PopoverContent
              className="w-[450px] p-0 overflow-hidden"
              asChild
              forceMount
            >
              <motion.div
                variants={popoverVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Command>
                  <CommandInputWrapper />
                  <CommandList className="h-[calc(400px-var(--command-input-height)-var(--command-footer-height))] overflow-y-auto">
                    <CommandEmpty>No agentSchema found.</CommandEmpty>

                    {hasActiveAgents && (
                      <CommandGroup heading={<ActiveGroupHeading />}>
                        {renderActiveAgents()}
                      </CommandGroup>
                    )}

                    {hasPinnedAgents && (
                      <CommandGroup heading={<PinnedGroupHeading />}>
                        {renderPinnedAgents()}
                      </CommandGroup>
                    )}

                    {Array.from(allAgentsByProvider.entries()).map(
                      ([provider, agentList]) => (
                        <CommandGroup
                          key={provider}
                          heading={<ProviderGroupHeading provider={provider} />}
                        >
                          {renderProviderAgents(provider, agentList)}
                        </CommandGroup>
                      ),
                    )}
                  </CommandList>
                  <CommandFooter onClose={handleClose} />
                </Command>
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </Fragment>
  );
}
