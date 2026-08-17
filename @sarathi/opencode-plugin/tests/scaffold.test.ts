import test from "node:test";
import assert from "node:assert/strict";
import {
  SarathiPlugin,
  SARATHI_PROVIDER_KEY,
  DEFAULT_MODEL_CACHE_TTL_MS,
  resolveSarathiPluginOptions,
} from "../src/index.js";

test("scaffold: exports public surface", () => {
  assert.equal(
    typeof SarathiPlugin,
    "function",
    "SarathiPlugin must be a function (Plugin factory)"
  );
  assert.equal(SARATHI_PROVIDER_KEY, "sarathi");
  assert.equal(DEFAULT_MODEL_CACHE_TTL_MS, 300_000);
});

test("scaffold: default export is v1 plugin shape { id, server: SarathiPlugin }", async () => {
  const mod = await import("../src/index.js");
  assert.equal(typeof mod.default, "object");
  assert.equal(mod.default.id, "@sarathi/opencode-plugin");
  assert.equal(mod.default.server, mod.SarathiPlugin);
});

test("resolveSarathiPluginOptions: defaults", () => {
  const r = resolveSarathiPluginOptions();
  assert.equal(r.providerId, "opencode-sarathi");
  assert.equal(r.displayName, "Sarathi");
  assert.equal(r.modelCacheTtl, 300_000);
  assert.equal(r.baseURL, undefined);
});

test("resolveSarathiPluginOptions: custom providerId derives displayName", () => {
  const r = resolveSarathiPluginOptions({ providerId: "sarathi-preprod" });
  assert.equal(r.providerId, "opencode-sarathi-preprod");
  assert.equal(r.displayName, "Sarathi (opencode-sarathi-preprod)");
});

test("resolveSarathiPluginOptions: explicit displayName wins", () => {
  const r = resolveSarathiPluginOptions({
    providerId: "sarathi-x",
    displayName: "Custom Label",
  });
  assert.equal(r.displayName, "Custom Label");
});

test("resolveSarathiPluginOptions: invalid TTL falls back to default", () => {
  assert.equal(resolveSarathiPluginOptions({ modelCacheTtl: 0 }).modelCacheTtl, 300_000);
  assert.equal(resolveSarathiPluginOptions({ modelCacheTtl: -1 }).modelCacheTtl, 300_000);
});

test("resolveSarathiPluginOptions: positive TTL respected", () => {
  assert.equal(resolveSarathiPluginOptions({ modelCacheTtl: 60_000 }).modelCacheTtl, 60_000);
});

test("SarathiPlugin: returns an empty hooks object (scaffold)", async () => {
  const fakeCtx = {} as Parameters<typeof SarathiPlugin>[0];
  const hooks = await SarathiPlugin(fakeCtx);
  assert.equal(typeof hooks, "object");
  assert.notEqual(hooks, null);
});

test("scaffold: built ESM default export resolves with the v1 plugin shape", async () => {
  // The plugin is ESM-only now — the CJS bundle was dropped to fix the OpenCode
  // loader (#3883), so there is no more ../dist/index.cjs. Validate that the built
  // distributable's default export still carries the OpenCode v1 { id, server } shape.
  const mod = await import("../dist/index.js");
  assert.strictEqual(typeof mod.default, "object");
  assert.strictEqual(mod.default.id, "@sarathi/opencode-plugin");
  assert.strictEqual(typeof mod.default.server, "function");
});
