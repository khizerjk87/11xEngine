import { ModelProvider } from './types';

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    key: 'openai',
    name: 'ChatGPT',
    variants: [
      { id: 'openai/gpt-4o-mini', name: 'GPT 4o - mini', costPerToken: 0.00000015 },
      { id: 'openai/gpt-4o', name: 'GPT 4o', costPerToken: 0.000005 },
      { id: 'openai/gpt-5.2', name: 'GPT-5.2', costPerToken: 0.000015 },
      { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini', costPerToken: 0.000002 },
      { id: 'openai/gpt-4.1-mini', name: 'GPT 4.1 Mini', costPerToken: 0.000001 },
      { id: 'openai/gpt-4.1', name: 'GPT 4.1', costPerToken: 0.000008 },
      { id: 'openai/gpt-5', name: 'GPT 5', costPerToken: 0.000025 },
      { id: 'openai/gpt-5.1', name: 'GP5 5.1', costPerToken: 0.00003 },
      { id: 'openai/gpt-5-nano', name: 'GPT 5 Nano', costPerToken: 0.0000005 },
      { id: 'openai/gpt-4.1-nano', name: 'GPT 4.1 Nano', costPerToken: 0.0000003 }
    ],
    logo: null
  },
  {
    key: 'anthropic',
    name: 'Claude',
    variants: [
      { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', costPerToken: 0.000003 },
      { id: 'anthropic/claude-sonnet-4.5', name: 'Claude 4.5 Sonnet', costPerToken: 0.000015 },
      { id: 'anthropic/claude-opus-4.5', name: 'Claude 4.5 Opus', costPerToken: 0.000045 },
      { id: 'anthropic/claude-haiku-4.5', name: 'Claude 4.5 Haiku', costPerToken: 0.000001 },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude 4 Sonnet', costPerToken: 0.000008 },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', costPerToken: 0.000003 },
      { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', costPerToken: 0.00000025 }
    ],
    logo: null
  },
  {
    key: 'google',
    name: 'Gemini',
    variants: [
      { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', costPerToken: 0.000015 },
      { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', costPerToken: 0.0000001 },
      { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', costPerToken: 0.00000125 },
      { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', costPerToken: 0.0000001 },
      { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', costPerToken: 0.000000075 }
    ],
    logo: null
  },
  {
    key: 'perplexity',
    name: 'Perplexity',
    variants: [
      { id: 'perplexity/sonar-deep-research', name: 'Sonar Deep Research', costPerToken: 0.00005 },
      { id: 'perplexity/sonar-reasoning-pro', name: 'Sonar Reasoning Pro', costPerToken: 0.00001 },
      { id: 'perplexity/sonar-reasoning', name: 'Sonar Reasoning', costPerToken: 0.000005 },
      { id: 'perplexity/sonar-pro', name: 'Sonar Pro', costPerToken: 0.000005 },
      { id: 'perplexity/sonar', name: 'Sonar', costPerToken: 0.000001 }
    ],
    logo: null
  },
  {
    key: 'deepseek',
    name: 'DeepSeek',
    variants: [
      { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek v3.2', costPerToken: 0.0000002 },
      { id: 'deepseek/deepseek-chat-v3.1', name: 'DeepSeek Chat v3.1', costPerToken: 0.00000014 }
    ],
    logo: null
  }
];

export const STORAGE_KEYS = {
  SETTINGS: '11x_user_settings',
  HISTORY: '11x_chat_history'
};

export const ALL_VARIANTS = MODEL_PROVIDERS.flatMap(p => p.variants);