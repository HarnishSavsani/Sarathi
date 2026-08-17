/** JobRegistry singleton - survives Next.js HMR via globalThis. */

import { JobRegistry } from "./registry";
import type { JobDefinition } from "./core";

declare global {
  var __sarathiJobRegistry: JobRegistry | undefined;
}

export function getJobRegistry(): JobRegistry {
  if (!globalThis.__sarathiJobRegistry) {
    globalThis.__sarathiJobRegistry = new JobRegistry();
  }
  return globalThis.__sarathiJobRegistry;
}

/** Test-only: drop the singleton so each test starts fresh. */
export function __resetJobRegistry(): void {
  globalThis.__sarathiJobRegistry = undefined;
}

export type { JobDefinition, JobRecord, HandlerResult, JobRun } from "./core";
