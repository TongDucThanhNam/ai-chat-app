"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Agent } from "@/types";
import { obsidianPrompt, codePrompt } from "@/lib/ai/prompts";
import { availableAgents } from "@/lib/ai/agents";

interface AgentState {
  selectedAgent: Agent;
  availableAgents: Agent[];
  setSelectedAgent: (agent: Agent) => void;
  updateAgentSystem: (system: string) => void;
  isSearchEnabled: boolean;
  setIsSearchEnabled: (enabled: boolean) => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      isSearchEnabled: false,
      selectedAgent: {
        model: {
          id: "qwen-qwq-32b",
          name: "QWQ 32B",
          provider: "groq" as any,
        },
        temperature: 0.6,
        topP: 0.95,
        system: obsidianPrompt,
        tools: ["getWeatherInformation", "askForConfirmation", "getLocation"],
        maxSteps: 5,
      },
      availableAgents: availableAgents,
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),
      updateAgentSystem: (system) =>
        set((state) => ({
          selectedAgent: {
            ...state.selectedAgent,
            system,
          },
        })),
      setIsSearchEnabled: (enabled) => set({ isSearchEnabled: enabled }),
    }),
    {
      name: "agent-storage", // tên của key trong localStorage
    },
  ),
);
