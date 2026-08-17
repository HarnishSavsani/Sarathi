export interface ImageProviderConfig {
  id: string;
  baseUrl: string;
  authType: string;
  authHeader: string;
  format: string;
  models: Array<{
    id: string;
    name: string;
    inputModalities?: string[];
    description?: string;
  }>;
  supportedSizes: string[];
  alias?: string;
  routingAliases?: string[];
}

export interface ImageCatalogModelEntry {
  id: string;
  name: string;
  provider: string;
  supportedSizes: string[];
  inputModalities: string[];
  description?: string;
  mediaCapabilities?: any;
}

export const IMAGE_PROVIDERS: Record<string, ImageProviderConfig> = {};
export const IMAGE_MODEL_ALIASES: Record<string, any> = {};

export function getImageProvider(providerId) {
  return null;
}

export function parseImageModel(modelStr) {
  return { provider: null, model: modelStr };
}

export function getAllImageModels(): ImageCatalogModelEntry[] {
  return [];
}

export function getImageModelAliases() {
  return {};
}

export function isRegisteredImageModel(providerId, modelId) {
  return false;
}

export function getImageModelEntry(modelStr) {
  return null;
}

export function modalitiesRequireImageInput(inputModalities) {
  return false;
}
