export const WEB_COOKIE_PROVIDERS = {};

export interface WebProviderHostLink {
  url: string;
  host: string;
}

export function resolveWebProviderHost(
  providerId: string | null | undefined,
  fallbackBaseUrl?: string | null
): WebProviderHostLink | null {
  return null;
}
