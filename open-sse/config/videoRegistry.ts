interface VideoModel {
  id: string;
  name: string;
  isMarket?: boolean;
  supportedSizes?: string[];
  mediaCapabilities?: Record<string, unknown>;
}

interface VideoProvider {
  id: string;
  alias?: string;
  baseUrl: string;
  statusUrl?: string;
  authType: string;
  authHeader: string;
  format: string;
  models: VideoModel[];
}

export const VIDEO_PROVIDERS: Record<string, VideoProvider> = {};

export function getVideoProvider(providerId: string): VideoProvider | null {
  return null;
}

export function parseVideoModel(modelStr: string | null) {
  return { provider: null, model: modelStr };
}

export function getAllVideoModels() {
  return [];
}
