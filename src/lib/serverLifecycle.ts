export type ServerLifecyclePhase = "starting" | "ready" | "stopping";

declare global {
  var __sarathiServerLifecycle: ServerLifecyclePhase | undefined;
}

export function getServerLifecyclePhase(): ServerLifecyclePhase {
  return globalThis.__sarathiServerLifecycle ?? "starting";
}

export function markServerStarting(): void {
  globalThis.__sarathiServerLifecycle = "starting";
}

export function markServerReady(): void {
  if (getServerLifecyclePhase() !== "stopping") {
    globalThis.__sarathiServerLifecycle = "ready";
  }
}

export function markServerStopping(): void {
  globalThis.__sarathiServerLifecycle = "stopping";
}
