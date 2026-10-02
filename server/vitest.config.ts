import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
      PORT: '4000',
      CORS_ORIGINS: 'http://localhost:5173',
      JWT_ACCESS_SECRET: 'test-secret-that-is-at-least-32-characters-long',
      DB_DRIVER: 'memory',
    },
  },
});
