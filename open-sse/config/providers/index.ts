import type { RegistryEntry } from "./shared.ts";

import { antigravityProvider } from "./registry/antigravity/index.ts";
import { agyProvider } from "./registry/agy/index.ts";
import { claudeProvider } from "./registry/claude/index.ts";
import { claude_webProvider } from "./registry/claude/web/index.ts";
import { codexProvider } from "./registry/codex/index.ts";
import { traeProvider } from "./registry/trae/index.ts";
import { cursorProvider } from "./registry/cursor/index.ts";

import { chatgpt_web_codexProvider } from "./registry/chatgpt-web-codex/index.ts";
import { deepseek_webProvider } from "./registry/deepseek/web/index.ts";
import { gemini_webProvider } from "./registry/gemini/web/index.ts";
import { huggingchatProvider } from "./registry/huggingchat/index.ts";

import { anthropicProvider } from "./registry/anthropic/index.ts";
import { deepseekProvider } from "./registry/deepseek/index.ts";
import { geminiProvider } from "./registry/gemini/index.ts";
import { groqProvider } from "./registry/groq/index.ts";
import { huggingfaceProvider } from "./registry/huggingface/index.ts";
import { nvidiaProvider } from "./registry/nvidia/index.ts";
import { openaiProvider } from "./registry/openai/index.ts";

import { duckduckgo_webProvider } from "./registry/duckduckgo-web/index.ts";
import { opencodeProvider } from "./registry/opencode/index.ts";
import { openrouterProvider } from "./registry/openrouter/index.ts";
import { bedrockProvider } from "./registry/bedrock/index.ts";
import { ollama_cloudProvider } from "./registry/ollama-cloud/index.ts";

export const REGISTRY: Record<string, RegistryEntry> = {
  antigravity: antigravityProvider,
  agy: agyProvider,
  claude: claudeProvider,
  "claude-web": claude_webProvider,
  codex: codexProvider,
  trae: traeProvider,
  cursor: cursorProvider,

  "chatgpt-web-codex": chatgpt_web_codexProvider,
  "deepseek-web": deepseek_webProvider,
  "gemini-web": gemini_webProvider,
  huggingchat: huggingchatProvider,

  anthropic: anthropicProvider,
  deepseek: deepseekProvider,
  gemini: geminiProvider,
  groq: groqProvider,
  huggingface: huggingfaceProvider,
  nvidia: nvidiaProvider,
  openai: openaiProvider,

  "duckduckgo-web": duckduckgo_webProvider,
  opencode: opencodeProvider,
  openrouter: openrouterProvider,
  bedrock: bedrockProvider,
  ollama: ollama_cloudProvider,
};
