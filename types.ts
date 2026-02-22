
import React from 'react';

export interface ModelVariant {
  id: string;
  name: string;
  costPerToken: number;
}

export interface ModelProvider {
  key: string; // e.g., 'openai'
  name: string;
  logo: React.ReactNode;
  variants: ModelVariant[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ModelResponse {
  modelId: string;
  content: string;
  isStreaming: boolean;
  tokensUsed: number;
  estimatedCost: number;
}

export interface Multiplex {
  id: string;
  title: string;
  prompt: string;
  timestamp: number;
  responses: Record<string, string>; // modelId -> content
}

export interface UserSettings {
  activeModelIds: string[];
  providerVariants: Record<string, string>; // providerKey -> selected variantId
}
