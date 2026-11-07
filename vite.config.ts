import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import handler from './api/chef.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'groq-chef-api',
        configureServer(server) {
          server.middlewares.use('/api/chef', async (req, res) => {
            await handler(req, res);
          });
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
  };
});
