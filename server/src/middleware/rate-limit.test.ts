import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import {
  API_PREFIX,
  API_ROUTES,
  ERROR_CODES,
  HTTP_STATUS,
  RATE_LIMIT,
  SYSTEM_ROUTES,
} from '../constants/index.js';
import { createMemoryDatabase } from '../database/memory/index.js';

const LOGIN_URL = `${API_PREFIX}${API_ROUTES.AUTH.ROOT}${API_ROUTES.AUTH.LOGIN}`;
const wrongLogin = { email: 'nobody@example.com', password: 'wrong-password' };

describe('auth rate limit', () => {
  it('rejects login attempts over the limit with TOO_MANY_REQUESTS', async () => {
    const app = createApp(createMemoryDatabase());
    for (let attempt = 0; attempt < RATE_LIMIT.AUTH_MAX_REQUESTS; attempt += 1) {
      await request(app).post(LOGIN_URL).send(wrongLogin);
    }

    const response = await request(app).post(LOGIN_URL).send(wrongLogin);

    expect(response.status).toBe(HTTP_STATUS.TOO_MANY_REQUESTS);
    expect(response.body.error.code).toBe(ERROR_CODES.TOO_MANY_REQUESTS);
    expect(response.body.requestId).toBeTypeOf('string');
  });

  it('sends the standard RateLimit headers', async () => {
    const response = await request(createApp(createMemoryDatabase()))
      .post(LOGIN_URL)
      .send(wrongLogin);

    expect(response.headers['ratelimit-policy']).toBeDefined();
  });
});

describe('general rate limit', () => {
  it('does not count health checks', async () => {
    const response = await request(createApp(createMemoryDatabase())).get(SYSTEM_ROUTES.HEALTH);

    expect(response.headers['ratelimit-policy']).toBeUndefined();
  });
});
