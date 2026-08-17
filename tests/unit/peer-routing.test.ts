import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import {
  applyPeerTraceHeader,
  inspectPeerRequest,
  isConfiguredSarathiPeer,
  parsePeerTrace,
} from "../../src/shared/resilience/peerRouting";

const env = {
  SARATHI_INSTANCE_ID: "gateway-a",
  SARATHI_PEER_URLS: "http://gateway-b:20128/v1,https://peer.example/api/v1/",
  SARATHI_PEER_MAX_HOPS: "4",
};

test("peer routing stays disabled without an instance id", () => {
  const headers: Record<string, string> = {};
  assert.equal(
    applyPeerTraceHeader(headers, null, "http://gateway-b:20128/v1/chat/completions", {
      ...env,
      SARATHI_INSTANCE_ID: undefined,
    }),
    false
  );
  assert.deepEqual(headers, {});
  assert.equal(
    inspectPeerRequest(new Headers({ "X-Sarathi-Peer-Trace": "gateway-a" }), {}),
    null
  );
});

test("peer URL matching requires the configured origin and path boundary", () => {
  assert.equal(isConfiguredSarathiPeer("http://gateway-b:20128/v1/chat/completions", env), true);
  assert.equal(isConfiguredSarathiPeer("https://peer.example/api/v1/responses", env), true);
  assert.equal(
    isConfiguredSarathiPeer("http://gateway-b:20128/v10/chat/completions", env),
    false
  );
  assert.equal(
    isConfiguredSarathiPeer("http://gateway-b.evil:20128/v1/chat/completions", env),
    false
  );
});

test("outbound peer calls append the local instance to the existing trace", () => {
  const headers: Record<string, string> = { Authorization: "Bearer test" };
  const applied = applyPeerTraceHeader(
    headers,
    { "x-sarathi-peer-trace": "edge,gateway-z" },
    "http://gateway-b:20128/v1/chat/completions",
    env
  );
  assert.equal(applied, true);
  assert.equal(headers["X-Sarathi-Peer-Trace"], "edge,gateway-z,gateway-a");
  assert.equal(headers.Authorization, "Bearer test");
});

test("non-peer providers never receive peer metadata", () => {
  const headers: Record<string, string> = {};
  assert.equal(
    applyPeerTraceHeader(headers, null, "https://api.openai.com/v1/chat/completions", env),
    false
  );
  assert.equal(headers["X-Sarathi-Peer-Trace"], undefined);
});

test("ingress rejects a repeated instance and an exhausted hop budget", () => {
  assert.deepEqual(
    inspectPeerRequest(new Headers({ "X-Sarathi-Peer-Trace": "edge,gateway-a" }), env),
    {
      code: "peer_loop_detected",
      message: "Sarathi peer routing loop detected",
    }
  );
  assert.deepEqual(
    inspectPeerRequest(
      { "X-Sarathi-Peer-Trace": "gateway-w,gateway-x,gateway-y,gateway-z" },
      env
    ),
    {
      code: "peer_hop_limit_exceeded",
      message: "Sarathi peer routing hop limit exceeded",
    }
  );
});

test("trace parsing drops invalid IDs and oversized untrusted values", () => {
  assert.deepEqual(parsePeerTrace("gateway-a, bad id, gateway_b"), ["gateway-a", "gateway_b"]);
  assert.deepEqual(parsePeerTrace("x".repeat(2049)), []);
});

test("BaseExecutor adds the trace only on an allowlisted peer dispatch", async () => {
  const previous = {
    instanceId: process.env.SARATHI_INSTANCE_ID,
    peerUrls: process.env.SARATHI_PEER_URLS,
    maxHops: process.env.SARATHI_PEER_MAX_HOPS,
  };
  let capturedTrace: string | undefined;
  const server = createServer((request, response) => {
    capturedTrace = request.headers["x-sarathi-peer-trace"];
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ choices: [] }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const peerBaseUrl = `http://127.0.0.1:${address.port}/v1`;

  process.env.SARATHI_INSTANCE_ID = "gateway-a";
  process.env.SARATHI_PEER_URLS = peerBaseUrl;
  process.env.SARATHI_PEER_MAX_HOPS = "4";

  try {
    const { BaseExecutor } = await import("../../open-sse/executors/base.ts");
    const executor = new BaseExecutor("openai-compatible-peer", {
      baseUrl: peerBaseUrl,
    });
    await executor.execute({
      model: "peer-model",
      body: { model: "peer-model", messages: [{ role: "user", content: "ping" }] },
      stream: false,
      credentials: {
        apiKey: "peer-key",
        providerSpecificData: { baseUrl: peerBaseUrl },
      },
      clientHeaders: { "x-sarathi-peer-trace": "edge" },
      upstreamExtraHeaders: { "x-sarathi-peer-trace": "overridden" },
    });

    assert.equal(capturedTrace, "edge,gateway-a");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    if (previous.instanceId === undefined) delete process.env.SARATHI_INSTANCE_ID;
    else process.env.SARATHI_INSTANCE_ID = previous.instanceId;
    if (previous.peerUrls === undefined) delete process.env.SARATHI_PEER_URLS;
    else process.env.SARATHI_PEER_URLS = previous.peerUrls;
    if (previous.maxHops === undefined) delete process.env.SARATHI_PEER_MAX_HOPS;
    else process.env.SARATHI_PEER_MAX_HOPS = previous.maxHops;
  }
});

test("handleChat rejects a reciprocal peer loop before provider routing", async () => {
  const previous = process.env.SARATHI_INSTANCE_ID;
  process.env.SARATHI_INSTANCE_ID = "gateway-a";
  try {
    const { handleChat } = await import("../../src/sse/handlers/chat.ts");
    const response = await handleChat(
      new Request("http://gateway-a:20128/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sarathi-Peer-Trace": "gateway-b,gateway-a",
        },
        body: JSON.stringify({
          model: "steady-free",
          messages: [{ role: "user", content: "ping" }],
        }),
      })
    );

    assert.equal(response.status, 508);
    assert.match(await response.text(), /peer routing loop detected/i);
  } finally {
    if (previous === undefined) delete process.env.SARATHI_INSTANCE_ID;
    else process.env.SARATHI_INSTANCE_ID = previous;
  }
});
