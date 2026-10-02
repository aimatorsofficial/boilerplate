import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { API_PREFIX, API_ROUTES, ERROR_CODES, HTTP_STATUS, ROLES } from '../../constants/index.js';
import { createMemoryDatabase } from '../../database/memory/index.js';
import { authHeaderFor } from '../auth/auth.test-support.js';

const USERS_URL = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;
const USER_URL = `${USERS_URL}/${randomUUID()}`;
const app = createApp(createMemoryDatabase());

describe('users access control', () => {
  it('rejects a request without a token with UNAUTHORIZED', async () => {
    const response = await request(app).get(USERS_URL);

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(response.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it.each([
    ['get', USERS_URL],
    ['post', USERS_URL],
    ['get', USER_URL],
    ['patch', USER_URL],
    ['delete', USER_URL],
  ] as const)('rejects %s %s from a non-admin with FORBIDDEN', async (method, url) => {
    const client = request(app);
    const response = await client[method](url).set(await authHeaderFor(ROLES.USER));

    expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
    expect(response.body.error.code).toBe(ERROR_CODES.FORBIDDEN);
  });
});
