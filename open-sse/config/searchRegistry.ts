/**
 * Search Provider Registry — stubbed out for hackathon build.
 * Search providers removed from scope. Keep interfaces and empty exports
 * so all import sites continue to compile without changes.
 */

export interface SearchProviderConfig {
  id: string;
  name: string;
  baseUrl: string;
  method: "GET" | "POST";
  authType: "apikey" | "none";
  authHeader: string;
  costPerQuery: number;
  freeMonthlyQuota: number;
  searchTypes: string[];
  defaultMaxResults: number;
  maxMaxResults: number;
  timeoutMs: number;
  cacheTTLMs: number;
  fallbackOnly?: boolean;
}

export const SEARCH_PROVIDERS: Record<string, SearchProviderConfig> = {};

export const SEARCH_CREDENTIAL_FALLBACKS: Record<string, string> = {};

export function getSearchProvider(providerId: string): SearchProviderConfig | null {
  return null;
}

export function supportsSearchType(
  providerOrId: SearchProviderConfig | string | null | undefined,
  searchType: string
): boolean {
  return false;
}

export function getAllSearchProviders(): Array<{
  id: string;
  name: string;
  searchTypes: string[];
}> {
  return [];
}

export function selectProvider(
  explicitProvider?: string,
  searchType?: string
): SearchProviderConfig | null {
  return null;
}
