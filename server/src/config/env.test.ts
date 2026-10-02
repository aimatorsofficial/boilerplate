import { describe, expect, it } from 'vitest';
import { loadEnv } from './env.js';

const validSource = {
  NODE_ENV: 'production',
  PORT: '4000',
  LOG_LEVEL: 'warn',
  CORS_ORIGINS: 'http://localhost:5173, https://app.example.com',
};

describe('loadEnv', () => {
  it('parses a valid environment', () => {
    const env = loadEnv(validSource);

    expect(env.PORT).toBe(4000);
    expect(env.CORS_ORIGINS).toEqual(['http://localhost:5173', 'https://app.example.com']);
  });

  it('uses defaults for optional values', () => {
    const env = loadEnv({ PORT: '4000', CORS_ORIGINS: 'http://localhost:5173' });

    expect(env.NODE_ENV).toBe('development');
    expect(env.LOG_LEVEL).toBe('info');
  });

  it('refuses to start when PORT is missing', () => {
    expect(() => loadEnv({ CORS_ORIGINS: 'http://localhost:5173' })).toThrow(/PORT/);
  });

  it('refuses a CORS origin that is not a URL', () => {
    expect(() => loadEnv({ ...validSource, CORS_ORIGINS: 'not-a-url' })).toThrow(/CORS_ORIGINS/);
  });
});
