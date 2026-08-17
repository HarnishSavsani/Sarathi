/**
 * chatCore non-streaming success response headers (Quality Gate v2 / Fase 9 — chatCore god-file
 * decomposition, #3501).
 *
 * Extracted from handleChatCore's non-streaming success path: build the response header map for a
 * cache-MISS JSON response — the static Content-Type + cache marker, the Sarathi meta headers
 * (provider/model/latency/usage/cost/request-id), and the optional compression header. Pure builder
 * (returns a fresh map; only mutates the map it owns). Behaviour is byte-identical to the previous
 * inline block, including `latencyMs: now - startTime`.
 */
import { SARATHI_RESPONSE_HEADERS } from "@/shared/constants/headers";
import { attachSarathiMetaHeaders as defaultAttachMeta } from "@/domain/sarathiResponseMeta";

export function buildNonStreamingResponseHeaders(
  args: {
    provider: string | null | undefined;
    model: string | null | undefined;
    startTime: number;
    responseUsage: Record<string, unknown> | null | undefined;
    estimatedCost: number;
    requestId: string | null | undefined;
    compressionResponseMeta?: string | null | undefined;
    comboStrategy?: string | null | undefined;
  },
  deps: { attachSarathiMetaHeaders: typeof defaultAttachMeta; now: () => number } = {
    attachSarathiMetaHeaders: defaultAttachMeta,
    now: Date.now,
  }
): Record<string, string> {
  const responseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    [SARATHI_RESPONSE_HEADERS.cache]: "MISS",
  };
  deps.attachSarathiMetaHeaders(responseHeaders, {
    provider: args.provider,
    model: args.model,
    cacheHit: false,
    latencyMs: deps.now() - args.startTime,
    usage: args.responseUsage,
    costUsd: args.estimatedCost,
    requestId: args.requestId,
    strategy: args.comboStrategy ?? "single",
  });
  if (args.compressionResponseMeta) {
    responseHeaders[SARATHI_RESPONSE_HEADERS.compression] = args.compressionResponseMeta;
  }
  return responseHeaders;
}
