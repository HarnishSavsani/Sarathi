export const APIKEY_PROVIDERS_GATEWAYS = {
  openrouter: {
    id: "openrouter",
    alias: "openrouter",
    name: "OpenRouter",
    icon: "router",
    color: "#F97316",
    textIcon: "OR",
    passthroughModels: true,
    website: "https://openrouter.ai",
    hasFree: true,
    freeNote: "Free models at $0/token with :free suffix - 20 RPM / 200 RPD",
    serviceKinds: ["llm", "imageToText"],
  },
};
