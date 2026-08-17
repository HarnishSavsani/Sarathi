import test from "node:test";
import assert from "node:assert/strict";

import {
  attachSarathiMetaHeaders,
  buildSarathiResponseMetaHeaders,
  buildSarathiSseMetadataComment,
  formatSarathiCost,
  getSarathiTokenCounts,
} from "../../src/domain/sarathiResponseMeta.ts";
import { APP_CONFIG } from "../../src/shared/constants/appConfig.ts";
import { SARATHI_RESPONSE_HEADERS } from "../../src/shared/constants/headers.ts";

test("getSarathiTokenCounts normalizes common usage shapes", () => {
  assert.deepEqual(
    getSarathiTokenCounts({
      prompt_tokens: 12,
      completion_tokens: 5,
    }),
    { input: 12, output: 5 }
  );
  assert.deepEqual(
    getSarathiTokenCounts({
      input_tokens: "9",
      output_tokens: "4",
    }),
    { input: 9, output: 4 }
  );
});

test("buildSarathiResponseMetaHeaders formats provider alias, tokens, latency, and cost", () => {
  const headers = buildSarathiResponseMetaHeaders({
    provider: "claude",
    model: "claude-sonnet-4-6",
    cacheHit: true,
    latencyMs: 1234.6,
    usage: {
      prompt_tokens: 11,
      completion_tokens: 7,
    },
    costUsd: 0.00123456789,
  });

  assert.equal(headers["X-Sarathi-Provider"], "cc");
  assert.equal(headers["X-Sarathi-Model"], "claude-sonnet-4-6");
  assert.equal(headers["X-Sarathi-Cache-Hit"], "true");
  assert.equal(headers["X-Sarathi-Latency-Ms"], "1235");
  assert.equal(headers["X-Sarathi-Tokens-In"], "11");
  assert.equal(headers["X-Sarathi-Tokens-Out"], "7");
  assert.equal(headers["X-Sarathi-Response-Cost"], "0.0012345679");
});

test("buildSarathiResponseMetaHeaders keeps ASCII model header values unchanged", () => {
  const headers = buildSarathiResponseMetaHeaders({
    provider: "openai",
    model: "gpt-4o-mini",
  });

  assert.equal(headers[SARATHI_RESPONSE_HEADERS.model], "gpt-4o-mini");
});

test("buildSarathiResponseMetaHeaders percent-encodes non-ASCII model header values", () => {
  const model = "free-mix/[假流式]gemini-3.5-flash";
  const headers = buildSarathiResponseMetaHeaders({
    provider: "openai",
    model,
  });

  assert.equal(headers[SARATHI_RESPONSE_HEADERS.model], encodeURIComponent(model));
  assert.doesNotThrow(() => new Headers(headers));
});

test("buildSarathiResponseMetaHeaders strips control characters from string header values", () => {
  const headers = buildSarathiResponseMetaHeaders({
    provider: "openai",
    model: "free\r\nX-Injected: yes\u0000-model",
    requestId: "req-1\nreq-2\rreq-3\u0007",
  });

  assert.doesNotMatch(headers[SARATHI_RESPONSE_HEADERS.model], /[\r\n\u0000-\u001f\u007f]/);
  assert.doesNotMatch(headers[SARATHI_RESPONSE_HEADERS.requestId], /[\r\n\u0000-\u001f\u007f]/);
  assert.equal(headers[SARATHI_RESPONSE_HEADERS.model], "freeX-Injected: yes-model");
  assert.equal(headers[SARATHI_RESPONSE_HEADERS.requestId], "req-1req-2req-3");
  assert.doesNotThrow(() => new Headers(headers));
});

test("buildSarathiResponseMetaHeaders always emits X-Sarathi-Version", () => {
  const headers = buildSarathiResponseMetaHeaders({ provider: "openai", model: "gpt" });
  assert.equal(headers[SARATHI_RESPONSE_HEADERS.version], APP_CONFIG.version);

  // Even with no provider/model at all, the version is still attached.
  const bare = buildSarathiResponseMetaHeaders({});
  assert.equal(bare[SARATHI_RESPONSE_HEADERS.version], APP_CONFIG.version);
});

test("buildSarathiResponseMetaHeaders emits X-Sarathi-Request-Id only when provided", () => {
  const withId = buildSarathiResponseMetaHeaders({ model: "gpt", requestId: "req-123" });
  assert.equal(withId[SARATHI_RESPONSE_HEADERS.requestId], "req-123");

  const noId = buildSarathiResponseMetaHeaders({ model: "gpt" });
  assert.equal(noId[SARATHI_RESPONSE_HEADERS.requestId], undefined);

  const nullId = buildSarathiResponseMetaHeaders({ model: "gpt", requestId: null });
  assert.equal(nullId[SARATHI_RESPONSE_HEADERS.requestId], undefined);

  const blankId = buildSarathiResponseMetaHeaders({ model: "gpt", requestId: "   " });
  assert.equal(blankId[SARATHI_RESPONSE_HEADERS.requestId], undefined);
});

test("attachSarathiMetaHeaders mutates a Headers instance in place, preserving existing entries", () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  attachSarathiMetaHeaders(headers, {
    provider: "openai",
    model: "gpt",
    requestId: "req-abc",
  });

  assert.equal(headers.get("Content-Type"), "application/json");
  assert.equal(headers.get(SARATHI_RESPONSE_HEADERS.version), APP_CONFIG.version);
  assert.equal(headers.get(SARATHI_RESPONSE_HEADERS.requestId), "req-abc");
  assert.equal(headers.get(SARATHI_RESPONSE_HEADERS.model), "gpt");
});

test("attachSarathiMetaHeaders mutates a plain record in place, preserving existing entries", () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  attachSarathiMetaHeaders(headers, {
    provider: "openai",
    model: "gpt",
  });

  assert.equal(headers["Content-Type"], "application/json");
  assert.equal(headers[SARATHI_RESPONSE_HEADERS.version], APP_CONFIG.version);
  assert.equal(headers[SARATHI_RESPONSE_HEADERS.model], "gpt");
  // No requestId provided → header omitted.
  assert.equal(headers[SARATHI_RESPONSE_HEADERS.requestId], undefined);
});

test("buildSarathiSseMetadataComment emits comment lines compatible with SSE", () => {
  const comment = buildSarathiSseMetadataComment({
    provider: "openai",
    model: "gpt-4o-mini",
    usage: {
      prompt_tokens: 4,
      completion_tokens: 2,
    },
    latencyMs: 50,
    costUsd: formatSarathiCost(0),
  });

  assert.match(comment, /^: x-sarathi-cache-hit=false/m);
  assert.match(comment, /^: x-sarathi-provider=openai/m);
  assert.match(comment, /^: x-sarathi-model=gpt-4o-mini/m);
  assert.match(comment, /^: x-sarathi-tokens-in=4/m);
  assert.match(comment, /^: x-sarathi-tokens-out=2/m);
  assert.match(comment, /^: x-sarathi-response-cost=0\.0000000000/m);
});

test("buildSarathiResponseMetaHeaders emits X-Sarathi-Cost-Saved only when costSavedUsd is provided", () => {
  // Cache HIT: the incremental cost of serving the hit is 0, but the cache saved the
  // original (would-have-been) cost — surfaced via the Cost-Saved header for analytics.
  const hit = buildSarathiResponseMetaHeaders({
    provider: "openai",
    model: "gpt-4o",
    cacheHit: true,
    costUsd: 0,
    costSavedUsd: 0.0125,
  });
  assert.equal(hit[SARATHI_RESPONSE_HEADERS.responseCost], "0.0000000000");
  assert.equal(hit[SARATHI_RESPONSE_HEADERS.costSaved], "0.0125000000");

  // A normal response (no costSavedUsd) omits the Cost-Saved header entirely.
  const miss = buildSarathiResponseMetaHeaders({
    provider: "openai",
    model: "gpt-4o",
    costUsd: 0.0125,
  });
  assert.equal(miss[SARATHI_RESPONSE_HEADERS.costSaved], undefined);

  // A free-model HIT still emits Cost-Saved (= 0) — it explicitly passed costSavedUsd.
  const freeHit = buildSarathiResponseMetaHeaders({
    cacheHit: true,
    costUsd: 0,
    costSavedUsd: 0,
  });
  assert.equal(freeHit[SARATHI_RESPONSE_HEADERS.costSaved], "0.0000000000");
});

test("attachSarathiMetaHeaders forwards costSavedUsd onto a Headers bag", () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  attachSarathiMetaHeaders(headers, {
    provider: "openai",
    model: "gpt-4o",
    cacheHit: true,
    costUsd: 0,
    costSavedUsd: 0.0125,
  });
  assert.equal(headers.get(SARATHI_RESPONSE_HEADERS.responseCost), "0.0000000000");
  assert.equal(headers.get(SARATHI_RESPONSE_HEADERS.costSaved), "0.0125000000");
});
