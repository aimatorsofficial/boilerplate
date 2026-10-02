import { describe, expect, it } from 'vitest';
import { DB_DRIVERS } from '../constants/index.js';
import { loadEnv } from './env.js';

const SECRET = 'a'.repeat(32);

const requiredOnly = {
  PORT: '4000',
  CORS_ORIGINS: 'http://localhost:5173',
  JWT_ACCESS_SECRET: SECRET,
};

const validSource = {
  ...requiredOnly,
  NODE_ENV: 'production',
  LOG_LEVEL: 'warn',
  CORS_ORIGINS: 'http://localhost:5173, https://app.example.com',
  DB_DRIVER: DB_DRIVERS.MONGO,
  MONGO_URI: 'mongodb://localhost:27017/app',
  TRUST_PROXY: '1',
};

describe('loadEnv', () => {
  it('parses a valid environment', () => {
    const env = loadEnv(validSource);

    expect(env.PORT).toBe(4000);
    expect(env.TRUST_PROXY).toBe(1);
    expect(env.CORS_ORIGINS).toEqual(['http://localhost:5173', 'https://app.example.com']);
  });

  it('uses defaults for optional values', () => {
    const env = loadEnv(requiredOnly);

    expect(env.NODE_ENV).toBe('development');
    expect(env.LOG_LEVEL).toBe('info');
    expect(env.DB_DRIVER).toBe(DB_DRIVERS.MEMORY);
    expect(env.TRUST_PROXY).toBe(0);
  });

  it('refuses to start when PORT is missing', () => {
    expect(() => loadEnv({ ...requiredOnly, PORT: undefined })).toThrow(/PORT/);
  });

  it('refuses a CORS origin that is not a URL', () => {
    expect(() => loadEnv({ ...validSource, CORS_ORIGINS: 'not-a-url' })).toThrow(/CORS_ORIGINS/);
  });

  it('refuses a JWT secret that is too short', () => {
    expect(() => loadEnv({ ...requiredOnly, JWT_ACCESS_SECRET: 'short' })).toThrow(
      /JWT_ACCESS_SECRET/,
    );
  });

  it('treats blank optional values as not set', () => {
    const env = loadEnv({ ...requiredOnly, MONGO_URI: '', SENTRY_DSN: '', METRICS_TOKEN: '' });

    expect(env.MONGO_URI).toBeUndefined();
    expect(env.SENTRY_DSN).toBeUndefined();
    expect(env.METRICS_TOKEN).toBeUndefined();
  });

  it('refuses a METRICS_TOKEN that is too short', () => {
    expect(() => loadEnv({ ...requiredOnly, METRICS_TOKEN: 'short' })).toThrow(/METRICS_TOKEN/);
  });

  it('refuses a SENTRY_DSN that is not a URL', () => {
    expect(() => loadEnv({ ...requiredOnly, SENTRY_DSN: 'not-a-url' })).toThrow(/SENTRY_DSN/);
  });

  it('requires MONGO_URI when DB_DRIVER is mongo', () => {
    expect(() => loadEnv({ ...requiredOnly, DB_DRIVER: DB_DRIVERS.MONGO })).toThrow(/MONGO_URI/);
  });
});
