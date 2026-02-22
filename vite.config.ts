import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Connect } from 'vite';

function openRouterProxyMiddleware(env: Record<string, string>): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.url !== '/api/openrouter' || req.method !== 'POST') {
      return next();
    }

    let body = '';
    req.on('data', (chunk: any) => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://11x-engine.ai',
            'X-Title': '11x Comparison Engine',
          },
          body,
        });

        res.writeHead(upstream.status, {
          'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        });

        const reader = upstream.body!.getReader();
        const pump = async (): Promise<void> => {
          const { done, value } = await reader.read();
          if (done) { res.end(); return; }
          res.write(value);
          return pump();
        };
        await pump();
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const proxyPlugin = {
      name: 'openrouter-proxy',
      configureServer(server: any) {
        server.middlewares.use(openRouterProxyMiddleware(env));
      },
      configurePreviewServer(server: any) {
        server.middlewares.use(openRouterProxyMiddleware(env));
      },
    };

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), proxyPlugin],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID),
        'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(env.FIREBASE_MEASUREMENT_ID),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
