
import { ChatMessage } from '../types';

export class OpenRouterService {
  private static API_URL = '/api/openrouter';

  static async streamChat(
    modelId: string,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: (fullContent: string) => void,
    onError: (error: any) => void
  ) {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch from OpenRouter';
        try {
          const errData = await response.json();
          errorMessage = errData?.error?.message || errorMessage;
        } catch (e) {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) throw new Error('ReadableStream not supported');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Handle SSE format correctly
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              onChunk(content);
            }
          } catch (e) {
            // Silently handle partial JSON chunks that occasionally occur in streaming
          }
        }
      }

      onComplete(fullContent);
    } catch (error: any) {
      onError(error);
    }
  }
}
