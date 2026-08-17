/**
 * T-08 options-schema tests.
 *
 * Covers `parseSarathiPluginOptions(opts)` — the strict Zod gate that
 * validates the second-arg `PluginOptions` bag from opencode.json before
 * any hook is wired. Anti-pattern checklist mirrored here:
 *
 *  - `null` / `undefined` must collapse to `{}` (defaults apply downstream).
 *  - Unknown keys must THROW (`.strict()` catches opencode.json typos).
 *  - Validation runs at parse time, not import time (module loads cleanly).
 */

import test from "node:test";
import assert from "node:assert/strict";
import { parseSarathiPluginOptions } from "../src/index.js";

test("parseSarathiPluginOptions: undefined → {}", () => {
  assert.deepEqual(parseSarathiPluginOptions(undefined), {});
});

test("parseSarathiPluginOptions: null → {}", () => {
  assert.deepEqual(parseSarathiPluginOptions(null), {});
});

test("parseSarathiPluginOptions: empty object → {}", () => {
  assert.deepEqual(parseSarathiPluginOptions({}), {});
});

test("parseSarathiPluginOptions: valid providerId → returns it", () => {
  const r = parseSarathiPluginOptions({ providerId: "sarathi-preprod" });
  assert.equal(r.providerId, "sarathi-preprod");
});

test("parseSarathiPluginOptions: invalid providerId (special chars) → throws", () => {
  assert.throws(
    () => parseSarathiPluginOptions({ providerId: "sarathi prod!" }),
    /providerId.*slug/i
  );
});

test("parseSarathiPluginOptions: empty providerId → throws", () => {
  assert.throws(() => parseSarathiPluginOptions({ providerId: "" }), /providerId/i);
});

test("parseSarathiPluginOptions: valid modelCacheTtl → returns it", () => {
  const r = parseSarathiPluginOptions({ modelCacheTtl: 60_000 });
  assert.equal(r.modelCacheTtl, 60_000);
});

test("parseSarathiPluginOptions: negative modelCacheTtl → throws", () => {
  assert.throws(() => parseSarathiPluginOptions({ modelCacheTtl: -1 }), /modelCacheTtl/i);
});

test("parseSarathiPluginOptions: zero modelCacheTtl → throws (positive required)", () => {
  assert.throws(() => parseSarathiPluginOptions({ modelCacheTtl: 0 }), /modelCacheTtl/i);
});

test("parseSarathiPluginOptions: invalid baseURL (not a URL) → throws", () => {
  assert.throws(() => parseSarathiPluginOptions({ baseURL: "not-a-url" }), /baseURL/i);
});

test("parseSarathiPluginOptions: unknown key → throws (strict mode catches typos)", () => {
  assert.throws(
    () =>
      parseSarathiPluginOptions({
        providerId: "sarathi",
        provider_id: "typo-here",
      }),
    /provider_id|unrecognized/i
  );
});

test("parseSarathiPluginOptions: all four fields populated correctly → returns them", () => {
  const opts = {
    providerId: "sarathi-prod",
    displayName: "Sarathi Production",
    modelCacheTtl: 120_000,
    baseURL: "https://or.example.com/v1",
  };
  const r = parseSarathiPluginOptions(opts);
  assert.deepEqual(r, opts);
});

test("parseSarathiPluginOptions: error message lists every issue path", () => {
  // Two bad fields at once → error string should mention BOTH.
  try {
    parseSarathiPluginOptions({
      providerId: "",
      baseURL: "garbage",
    });
    assert.fail("expected throw");
  } catch (err) {
    const msg = (err as Error).message;
    assert.match(msg, /providerId/);
    assert.match(msg, /baseURL/);
  }
});

test("parseSarathiPluginOptions: module import alone does NOT throw", async () => {
  // Re-importing the entry must not trigger validation; validation only fires
  // on explicit parseSarathiPluginOptions / SarathiPlugin invocation.
  const mod = await import("../src/index.js");
  assert.equal(typeof mod.parseSarathiPluginOptions, "function");
});
