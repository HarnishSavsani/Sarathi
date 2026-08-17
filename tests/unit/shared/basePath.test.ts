import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getDeployBasePath,
  normalizeBasePath,
  withBasePath,
} from "../../../src/shared/utils/basePath";

describe("normalizeBasePath", () => {
  it("normalizes leading/trailing slashes", () => {
    assert.equal(normalizeBasePath("sarathi"), "/sarathi");
    assert.equal(normalizeBasePath("/sarathi/"), "/sarathi");
    assert.equal(normalizeBasePath("/sarathi"), "/sarathi");
    assert.equal(normalizeBasePath(""), "");
    assert.equal(normalizeBasePath("/"), "");
    assert.equal(normalizeBasePath(null), "");
  });
});

describe("getDeployBasePath", () => {
  it("reads NEXT_PUBLIC_SARATHI_BASE_PATH first", () => {
    assert.equal(
      getDeployBasePath({
        NEXT_PUBLIC_SARATHI_BASE_PATH: "/sarathi",
        SARATHI_BASE_PATH: "/other",
      } as NodeJS.ProcessEnv),
      "/sarathi"
    );
  });

  it("falls back to SARATHI_BASE_PATH", () => {
    assert.equal(
      getDeployBasePath({
        SARATHI_BASE_PATH: "/sarathi",
      } as NodeJS.ProcessEnv),
      "/sarathi"
    );
  });
});

describe("withBasePath", () => {
  const base = "/sarathi";

  it("is a no-op when basePath is empty", () => {
    assert.equal(withBasePath("/api/health/ping", ""), "/api/health/ping");
  });

  it("prefixes absolute app paths", () => {
    assert.equal(withBasePath("/api/health/ping", base), "/sarathi/api/health/ping");
    assert.equal(withBasePath("/v1/models", base), "/sarathi/v1/models");
  });

  it("does not double-prefix", () => {
    assert.equal(withBasePath("/sarathi/api/health/ping", base), "/sarathi/api/health/ping");
    assert.equal(withBasePath("/sarathi", base), "/sarathi");
  });

  it("rewrites same-origin absolute URLs", () => {
    assert.equal(
      withBasePath("https://host.example/api/x", base, "https://host.example"),
      "https://host.example/sarathi/api/x"
    );
  });

  it("leaves external absolute URLs alone", () => {
    assert.equal(
      withBasePath("https://other.example/api/x", base, "https://host.example"),
      "https://other.example/api/x"
    );
  });

  it("leaves protocol-relative URLs alone", () => {
    assert.equal(withBasePath("//cdn.example/app.js", base), "//cdn.example/app.js");
  });
});
