import React, { memo } from "react";
import { type ModelProvider } from "@/types";
import OpenAI from "@/components/icons/openai";
import Gemini from "@/components/icons/gemini";
import ClaudeAI from "@/components/icons/claude";
import DeepSeek from "@/components/icons/deepseek";
import Grog from "@/components/icons/grog";

const OpenAIIcon = memo(OpenAI);
OpenAIIcon.displayName = "OpenAIIcon";

const GeminiIcon = memo(Gemini);
GeminiIcon.displayName = "GeminiIcon";

const AnthropicIcon = memo(ClaudeAI);
AnthropicIcon.displayName = "AnthropicIcon";

const DefaultIcon = memo(() => (
  <div className="h-4 w-4 rounded-full bg-gray-400" />
));
DefaultIcon.displayName = "DefaultIcon";

export const ProviderIcon = memo(function ProviderIcon({
  provider,
}: {
  provider: ModelProvider;
}) {
  const iconMap: { [key in ModelProvider]: React.ReactNode } = {
    openai: <OpenAIIcon />,
    gemini: <GeminiIcon />,
    anthropic: <AnthropicIcon />,
    deepseek: <DeepSeek />,
    groq: <Grog />,
    custom: <DefaultIcon />,
  };

  return iconMap[provider] || <DefaultIcon />;
});
ProviderIcon.displayName = "ProviderIcon";
