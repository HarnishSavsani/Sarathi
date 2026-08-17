import test from "node:test";
import assert from "node:assert/strict";
import { SARATHI_RESPONSE_HEADERS } from "../../src/shared/constants/headers.ts";
import { buildSarathiResponseMetaHeaders } from "../../src/domain/sarathiResponseMeta.ts";

test("headers constant exposes the fallback-attempts key", () => {
  assert.equal(
    SARATHI_RESPONSE_HEADERS.fallbackAttempts,
    "X-Sarathi-Fallback-Attempts"
  );
});

test("buildSarathiResponseMetaHeaders emits the fallback-attempts count when > 0", () => {
  const h = buildSarathiResponseMetaHeaders({ model: "gpt", provider: "openai", fallbackAttempts: 2 });
  assert.equal(h["X-Sarathi-Fallback-Attempts"], "2");
});

test("buildSarathiResponseMetaHeaders omits the header when 0 / absent", () => {
  const none = buildSarathiResponseMetaHeaders({ model: "gpt" });
  assert.equal(none["X-Sarathi-Fallback-Attempts"], undefined);
  const zero = buildSarathiResponseMetaHeaders({ model: "gpt", fallbackAttempts: 0 });
  assert.equal(zero["X-Sarathi-Fallback-Attempts"], undefined);
});
