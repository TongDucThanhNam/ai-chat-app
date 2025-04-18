import { Agent } from "@/types";
import { codePrompt, obsidianPrompt } from "./prompts";

export const availableAgents: Agent[] = [
  {
    model: {
      id: "DeepSeek-R1",
      name: "R1",
      provider: "deepseek",
      active: true,
      pinned: true,
    },
    temperature: 1.3,
    topP: 0.9,
    system: codePrompt,
    tools: [],
    maxSteps: 1,
  },
  {
    model: {
      id: "DeepSeek-V3",
      name: "V3 0324",
      provider: "deepseek",
      active: true,
      pinned: true,
    },
    temperature: 0.0,
    topP: 0.9,
    system: codePrompt,
    tools: [],
    maxSteps: 1,
  },

  {
    model: {
      id: "qwen-qwq-32b",
      name: "QWQ 32B",
      provider: "groq",
      active: true,
      pinned: true,
    },
    temperature: 0.7,
    topP: 0.9,
    system: obsidianPrompt,
    tools: [],
    maxSteps: 1,
  },
  {
    model: {
      id: "gemini-2.0-flash",
      name: "2.0 Flash",
      provider: "gemini",
      active: true,
      pinned: false,
    },
    temperature: 0.7,
    topP: 0.9,
    system: obsidianPrompt,
    tools: [],
    maxSteps: 1,
  },
  {
    model: {
      id: "o4-mini",
      name: "o4 mini",
      provider: "openai",
      active: true,
      pinned: false,
    },
    temperature: 0.7,
    topP: 0.9,
    system: obsidianPrompt,
    tools: [],
    maxSteps: 1,
  },
  {
    model: {
      id: "GPT-4.1",
      name: "GPT-4.1",
      provider: "openai",
      active: true,
      pinned: false,
    },
    temperature: 0.7,
    topP: 0.9,
    system: obsidianPrompt,
    tools: [],
    maxSteps: 1,
  },
];
