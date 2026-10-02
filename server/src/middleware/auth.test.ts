import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { ERROR_CODES, HTTP_STATUS, ROLES } from '../constants/index.js';
import { authHeaderFor } from '../modules/auth/auth.test-support.js';
import { signAccessToken } from '../modules/auth/auth.tokens.js';
import { authenticate, getAuth } from './auth.js';
import { errorHandler } from './error-handler.js';
import { requireRole } from './require-role.js';

const buildTestApp = () => {
  const app = express();
  app.get('/private', authenticate, (req, res) => {
    res.json(getAuth(req));
  });
  app.get('/admin', authenticate, requireRole(ROLES.ADMIN), (_req, res) => {
    res.json({ ok: true });
  });
  app.use(errorHandler);
  return app;
};

describe('authenticate', () => {
  it('lets a valid bearer token through and exposes the caller', async () => {
    const response = await request(buildTestApp())
      .get('/private')
      .set(await authHeaderFor(ROLES.USER));

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body).toEqual({ userId: 'user-1', role: ROLES.USER });
  });

  it('rejects a missing token with UNAUTHORIZED', async () => {
    const response = await request(buildTestApp()).get('/private');

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(response.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it('rejects a header without the Bearer prefix', async () => {
    const token = await signAccessToken({ userId: 'user-1', role: ROLES.USER });

    const response = await request(buildTestApp()).get('/private').set('Authorization', token);

    expect(response.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it('rejects a garbage token with UNAUTHORIZED', async () => {
    const response = await request(buildTestApp())
      .get('/private')
      .set('Authorization', 'Bearer not-a-jwt');

    expect(response.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });
});

describe('requireRole', () => {
  it('allows a caller with the required role', async () => {
    const response = await request(buildTestApp())
      .get('/admin')
      .set(await authHeaderFor(ROLES.ADMIN));

    expect(response.status).toBe(HTTP_STATUS.OK);
  });

  it('rejects a caller without the required role with FORBIDDEN', async () => {
    const response = await request(buildTestApp())
      .get('/admin')
      .set(await authHeaderFor(ROLES.USER));

    expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
    expect(response.body.error.code).toBe(ERROR_CODES.FORBIDDEN);
  });
});
