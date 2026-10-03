import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const DEV_SERVER_PORT = 5173;
const DEFAULT_API_PROXY_TARGET = 'http://localhost:4000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: DEV_SERVER_PORT,
    proxy: { '/api': process.env.API_PROXY_TARGET ?? DEFAULT_API_PROXY_TARGET },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
