import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { ERROR_CODES, HEALTH_STATUS, HTTP_STATUS, SYSTEM_ROUTES } from '../constants/index.js';
import { createMemoryDatabase } from '../database/memory/index.js';

describe('GET /ready', () => {
  it('reports ready when the database answers', async () => {
    const response = await request(createApp(createMemoryDatabase())).get(SYSTEM_ROUTES.READY);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data.status).toBe(HEALTH_STATUS.OK);
  });

  it('returns DATABASE_UNAVAILABLE when the database does not answer', async () => {
    const unreachable = { ...createMemoryDatabase(), isReady: () => Promise.resolve(false) };

    const response = await request(createApp(unreachable)).get(SYSTEM_ROUTES.READY);

    expect(response.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(response.body.error.code).toBe(ERROR_CODES.DATABASE_UNAVAILABLE);
  });
});
