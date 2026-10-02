import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import {
  ERROR_CODES,
  HEALTH_STATUS,
  HTTP_HEADERS,
  HTTP_STATUS,
  SYSTEM_ROUTES,
} from './constants/index.js';
import { createMemoryDatabase } from './database/memory/index.js';

const app = createApp(createMemoryDatabase());

describe('GET /health', () => {
  it('reports that the process is alive', async () => {
    const response = await request(app).get(SYSTEM_ROUTES.HEALTH);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data.status).toBe(HEALTH_STATUS.OK);
  });

  it('sends security headers', async () => {
    const response = await request(app).get(SYSTEM_ROUTES.HEALTH);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});

describe('request id', () => {
  it('reuses a safe incoming request id', async () => {
    const response = await request(app)
      .get(SYSTEM_ROUTES.HEALTH)
      .set(HTTP_HEADERS.REQUEST_ID, 'abc-123');

    expect(response.headers[HTTP_HEADERS.REQUEST_ID]).toBe('abc-123');
  });

  it('replaces an unsafe incoming request id', async () => {
    const unsafeId = '<script>alert(1)</script>';
    const response = await request(app)
      .get(SYSTEM_ROUTES.HEALTH)
      .set(HTTP_HEADERS.REQUEST_ID, unsafeId);

    expect(response.headers[HTTP_HEADERS.REQUEST_ID]).not.toBe(unsafeId);
  });
});

describe('error responses', () => {
  it('returns ROUTE_NOT_FOUND with a request id for an unknown route', async () => {
    const response = await request(app).get('/does-not-exist');

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.error.code).toBe(ERROR_CODES.ROUTE_NOT_FOUND);
    expect(response.body.requestId).toBe(response.headers[HTTP_HEADERS.REQUEST_ID]);
  });

  it('returns INVALID_JSON for a malformed body', async () => {
    const response = await request(app)
      .post('/does-not-exist')
      .set('Content-Type', 'application/json')
      .send('{"broken":');

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.INVALID_JSON);
  });

  it('returns PAYLOAD_TOO_LARGE for a body over the size limit', async () => {
    const response = await request(app)
      .post('/does-not-exist')
      .send({ text: 'x'.repeat(200_000) });

    expect(response.status).toBe(HTTP_STATUS.PAYLOAD_TOO_LARGE);
    expect(response.body.error.code).toBe(ERROR_CODES.PAYLOAD_TOO_LARGE);
  });
});
