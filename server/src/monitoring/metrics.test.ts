import { randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import {
  API_PREFIX,
  API_ROUTES,
  ERROR_CODES,
  HTTP_STATUS,
  METRICS,
  ROLES,
  SYSTEM_ROUTES,
} from '../constants/index.js';
import { createMemoryDatabase } from '../database/memory/index.js';
import { errorHandler } from '../middleware/error-handler.js';
import { authHeaderFor } from '../modules/auth/auth.test-support.js';
import { createMetrics, createMetricsRouter } from './metrics.js';

const USERS_URL = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;
const METRICS_TOKEN = 'a-metrics-token-long-enough';

const scrape = async (app: express.Express) => {
  const response = await request(app).get(SYSTEM_ROUTES.METRICS);
  return response.text;
};

describe('GET /metrics', () => {
  it('serves Prometheus text with default process metrics', async () => {
    const response = await request(createApp(createMemoryDatabase())).get(SYSTEM_ROUTES.METRICS);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toContain('process_cpu_user_seconds_total');
  });

  it('labels requests with the route pattern, not the raw URL', async () => {
    const app = createApp(createMemoryDatabase());
    await request(app)
      .get(`${USERS_URL}/${randomUUID()}`)
      .set(await authHeaderFor(ROLES.ADMIN));

    const text = await scrape(app);

    expect(text).toContain(`route="${USERS_URL}/:id",status="404"`);
    expect(text).not.toMatch(/route="[^"]*[0-9a-f]{8}-[0-9a-f]{4}/);
  });

  it('labels a module root route without a trailing slash', async () => {
    const app = createApp(createMemoryDatabase());
    await request(app)
      .get(USERS_URL)
      .set(await authHeaderFor(ROLES.ADMIN));

    expect(await scrape(app)).toContain(`route="${USERS_URL}",status="200"`);
  });

  it('groups unknown URLs under one label', async () => {
    const app = createApp(createMemoryDatabase());
    await request(app).get('/random/path/123');

    expect(await scrape(app)).toContain(`route="${METRICS.UNMATCHED_ROUTE}",status="404"`);
  });
});

describe('metrics token', () => {
  const buildTestApp = () => {
    const app = express();
    app.use(createMetricsRouter(createMetrics().registry, METRICS_TOKEN));
    app.use(errorHandler);
    return app;
  };

  it('rejects a scrape without the token with UNAUTHORIZED', async () => {
    const response = await request(buildTestApp()).get(SYSTEM_ROUTES.METRICS);

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(response.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it('rejects a wrong token', async () => {
    const response = await request(buildTestApp())
      .get(SYSTEM_ROUTES.METRICS)
      .set('Authorization', 'Bearer wrong-token');

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it('allows a scrape with the right token', async () => {
    const response = await request(buildTestApp())
      .get(SYSTEM_ROUTES.METRICS)
      .set('Authorization', `Bearer ${METRICS_TOKEN}`);

    expect(response.status).toBe(HTTP_STATUS.OK);
  });
});
