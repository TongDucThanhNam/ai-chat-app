import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { openai } from "@ai-sdk/openai";
// import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";
import { groq } from "@ai-sdk/groq";
import { deepseek } from "@ai-sdk/deepseek";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const yescale = createOpenAICompatible({
  name: "yescale",
  apiKey: process.env.YESCALE_API_KEY,
  baseURL: " https://api.yescale.io/v1",
});

const isTestEnvironment = false;

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model-small": chatModel,
        "chat-model-large": chatModel,
        "search-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": yescale("gemini-2.0-flash"),
        "title-model": yescale("gemini-2.0-flash"),
        "search-model": openai("o4-mini"),
        "chat-model-reasoning": wrapLanguageModel({
          model: groq("qwen-qwq-32b", {}),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "artifact-model": openai("o4-mini"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-2"),
        "large-model": openai.image("dall-e-3"),
      },
    });
