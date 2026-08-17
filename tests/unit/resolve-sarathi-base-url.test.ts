import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_SARATHI_BASE_URL,
  resolveSarathiBaseUrl,
} from "../../src/shared/utils/resolveSarathiBaseUrl.ts";

test("resolveSarathiBaseUrl prefers SARATHI_BASE_URL", () => {
  assert.equal(
    resolveSarathiBaseUrl({
      SARATHI_BASE_URL: "https://internal.example.com/",
      BASE_URL: "https://base.example.com",
      NEXT_PUBLIC_BASE_URL: "https://public.example.com",
    }),
    "https://internal.example.com"
  );
});

test("resolveSarathiBaseUrl falls back to BASE_URL", () => {
  assert.equal(
    resolveSarathiBaseUrl({
      BASE_URL: "https://base.example.com/",
      NEXT_PUBLIC_BASE_URL: "https://public.example.com",
    }),
    "https://base.example.com"
  );
});

test("resolveSarathiBaseUrl falls back to NEXT_PUBLIC_BASE_URL", () => {
  assert.equal(
    resolveSarathiBaseUrl({
      NEXT_PUBLIC_BASE_URL: "https://public.example.com/",
    }),
    "https://public.example.com"
  );
});

test("resolveSarathiBaseUrl ignores blank values", () => {
  assert.equal(
    resolveSarathiBaseUrl({
      SARATHI_BASE_URL: "   ",
      BASE_URL: "",
      NEXT_PUBLIC_BASE_URL: " https://public.example.com/ ",
    }),
    "https://public.example.com"
  );
});

test("resolveSarathiBaseUrl uses the default localhost fallback", () => {
  assert.equal(resolveSarathiBaseUrl({}), DEFAULT_SARATHI_BASE_URL);
});
