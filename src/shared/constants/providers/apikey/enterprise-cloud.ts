export const APIKEY_PROVIDERS_ENTERPRISE = {
  "azure-openai": {
    id: "azure-openai",
    alias: "azure",
    name: "Azure OpenAI",
    icon: "cloud",
    color: "#0078D4",
    textIcon: "AZ",
    website: "https://azure.microsoft.com/products/ai-services/openai-service",
    authHint:
      "Use your Azure OpenAI API key. Base URL should be your resource endpoint, for example https://my-resource.openai.azure.com.",
    passthroughModels: true,
  },
  "azure-ai": {
    id: "azure-ai",
    alias: "azure-ai",
    name: "Azure AI Foundry",
    icon: "cloud",
    color: "#2563EB",
    textIcon: "AF",
    website: "https://learn.microsoft.com/azure/ai-foundry",
    authHint:
      "Use your Azure AI Foundry key. Base URL can be https://<resource>.services.ai.azure.com/openai/v1/ or https://<resource>.openai.azure.com/openai/v1/.",
    apiHint:
      "Foundry uses the OpenAI v1 surface with deployment names as models. Sarathi normalizes root resource URLs to the v1 chat and /models endpoints.",
    passthroughModels: true,
  },
  bedrock: {
    id: "bedrock",
    alias: "bedrock",
    name: "Amazon Bedrock",
    icon: "cloud",
    color: "#FF9900",
    textIcon: "BR",
    website: "https://aws.amazon.com/bedrock",
    authHint:
      "Use your Amazon Bedrock API key and configure the AWS region where your models are enabled (for example eu-west-2). Sarathi calls Bedrock's native Converse API directly.",
    apiHint:
      "Native Bedrock integration: model discovery uses Bedrock foundation models and inference profiles, while chat uses the regional Bedrock Runtime Converse/ConverseStream APIs.",
    passthroughModels: true,
  },
};
