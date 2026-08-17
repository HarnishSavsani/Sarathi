/**
 * MCP Authorization Scopes — Defines permission scopes for each MCP tool.
 *
 * Each tool requires specific scopes to execute. API keys can be configured
 * with a subset of scopes to limit tool access (least-privilege).
 */

// ============ Scope Definitions ============

/** All available MCP scopes */
export const MCP_SCOPE_LIST = [
  "read:health",
  "read:combos",
  "write:combos",
  "read:quota",
  "read:usage",
  "read:models",
  "read:radar",
  "execute:completions",
  "execute:search",
  "write:budget",
  "write:resilience",
  "pricing:write",
  "read:cache",
  "write:cache",
  "read:compression",
  "write:compression",
  "read:proxies",
] as const;

export type McpScope = (typeof MCP_SCOPE_LIST)[number];

// ============ Tool → Scope Mapping ============

/** Maps each MCP tool to its required scopes */
export const MCP_TOOL_SCOPES: Record<string, readonly McpScope[]> = {
  // Phase 1: Essential Tools
  sarathi_get_health: ["read:health"],
  sarathi_list_combos: ["read:combos"],
  sarathi_get_combo_metrics: ["read:combos"],
  sarathi_switch_combo: ["write:combos"],
  sarathi_check_quota: ["read:quota"],
  sarathi_route_request: ["execute:completions"],
  sarathi_web_search: ["execute:search"],
  sarathi_web_fetch: ["execute:search"],
  sarathi_cost_report: ["read:usage"],
  sarathi_list_models_catalog: ["read:models"],
  sarathi_radar_catalog: ["read:radar"],

  // Phase 2: Advanced Tools
  sarathi_simulate_route: ["read:health", "read:combos"],
  sarathi_set_budget_guard: ["write:budget"],
  sarathi_set_resilience_profile: ["write:resilience"],
  sarathi_test_combo: ["execute:completions", "read:combos"],
  sarathi_get_provider_metrics: ["read:health"],
  sarathi_best_combo_for_task: ["read:combos", "read:health"],
  sarathi_explain_route: ["read:health", "read:usage"],
  sarathi_get_session_snapshot: ["read:usage"],
  sarathi_db_health_check: ["read:health", "write:resilience"],
  sarathi_sync_pricing: ["pricing:write"],
  sarathi_cache_stats: ["read:cache"],
  sarathi_cache_flush: ["write:cache"],
  sarathi_compression_status: ["read:compression"],
  sarathi_compression_configure: ["write:compression"],
  sarathi_set_compression_engine: ["write:compression"],
  sarathi_list_compression_combos: ["read:compression"],
  sarathi_compression_combo_stats: ["read:compression"],
  sarathi_ccr_store: ["write:compression"],
  sarathi_ccr_retrieve: ["read:compression"],
  sarathi_ccr_inspect: ["read:compression"],
  sarathi_ccr_list: ["read:compression"],
  sarathi_ccr_delete: ["write:compression"],
  sarathi_ccr_stats: ["read:compression"],
  sarathi_oneproxy_fetch: ["read:proxies"],
  sarathi_oneproxy_rotate: ["read:proxies"],
  sarathi_oneproxy_stats: ["read:proxies"],

  // Web-session pool observability (read) + lifecycle (write)
  sarathi_pool_status: ["read:health"],
  sarathi_pool_sessions: ["read:health"],
  sarathi_pool_health: ["read:health"],
  sarathi_pool_reset: ["write:resilience"],
  sarathi_pool_warm: ["write:resilience"],
  // Stealth browser pool observability (#3368 PR7)
  sarathi_browser_pool_status: ["read:health"],
} as const;
