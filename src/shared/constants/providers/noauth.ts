export const NOAUTH_PROVIDERS = {};

export const NOAUTH_PROVIDER_PROXY_SUPPORTED = new Set<string>();

export function supportsNoAuthProviderProxy(providerId: string): boolean {
  return false;
}
