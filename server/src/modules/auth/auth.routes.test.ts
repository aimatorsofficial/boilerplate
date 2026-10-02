import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { API_PREFIX, API_ROUTES, ERROR_CODES, HTTP_STATUS, ROLES } from '../../constants/index.js';
import { createMemoryDatabase } from '../../database/memory/index.js';

const { ROOT, REGISTER, LOGIN, REFRESH, LOGOUT, ME } = API_ROUTES.AUTH;
const url = (path: string) => `${API_PREFIX}${ROOT}${path}`;
const asha = { name: 'Asha', email: 'asha@example.com', password: 'a-long-password' };

let app: ReturnType<typeof createApp>;

const register = async () => {
  const response = await request(app).post(url(REGISTER)).send(asha);
  return response.body.data;
};

beforeEach(() => {
  app = createApp(createMemoryDatabase());
});

describe('POST /auth/register', () => {
  it('returns a token pair', async () => {
    const response = await request(app).post(url(REGISTER)).send(asha);

    expect(response.status).toBe(HTTP_STATUS.CREATED);
    expect(Object.keys(response.body.data).sort()).toEqual(['accessToken', 'refreshToken']);
  });

  it('ignores a role sent by the client', async () => {
    const response = await request(app)
      .post(url(REGISTER))
      .send({ ...asha, role: ROLES.ADMIN });
    const me = await request(app)
      .get(url(ME))
      .set('Authorization', `Bearer ${response.body.data.accessToken}`);

    expect(me.body.data.role).toBe(ROLES.USER);
  });

  it('rejects a short password with VALIDATION_FAILED', async () => {
    const response = await request(app)
      .post(url(REGISTER))
      .send({ ...asha, password: 'short' });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('POST /auth/login', () => {
  it('returns a token pair for the right password, whatever the email case', async () => {
    await register();

    const response = await request(app)
      .post(url(LOGIN))
      .send({ email: 'ASHA@example.com', password: asha.password });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data.accessToken).toBeTypeOf('string');
  });

  it('rejects a wrong password with INVALID_CREDENTIALS', async () => {
    await register();

    const response = await request(app)
      .post(url(LOGIN))
      .send({ email: asha.email, password: 'wrong-password' });

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(response.body.error.code).toBe(ERROR_CODES.INVALID_CREDENTIALS);
  });

  it('rejects a missing password with VALIDATION_FAILED', async () => {
    const response = await request(app).post(url(LOGIN)).send({ email: asha.email });

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('POST /auth/refresh', () => {
  it('returns a new pair and refuses the old refresh token afterwards', async () => {
    const { refreshToken } = await register();

    const first = await request(app).post(url(REFRESH)).send({ refreshToken });
    const second = await request(app).post(url(REFRESH)).send({ refreshToken });

    expect(first.status).toBe(HTTP_STATUS.OK);
    expect(second.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(second.body.error.code).toBe(ERROR_CODES.REFRESH_TOKEN_INVALID);
  });

  it('rejects a missing refresh token with VALIDATION_FAILED', async () => {
    const response = await request(app).post(url(REFRESH)).send({});

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('POST /auth/logout', () => {
  it('revokes the refresh token', async () => {
    const { refreshToken } = await register();

    const logout = await request(app).post(url(LOGOUT)).send({ refreshToken });
    const refresh = await request(app).post(url(REFRESH)).send({ refreshToken });

    expect(logout.status).toBe(HTTP_STATUS.NO_CONTENT);
    expect(refresh.body.error.code).toBe(ERROR_CODES.REFRESH_TOKEN_INVALID);
  });

  it('rejects a missing refresh token with VALIDATION_FAILED', async () => {
    const response = await request(app).post(url(LOGOUT)).send({});

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('GET /auth/me', () => {
  it('returns the signed-in user without the password hash', async () => {
    const { accessToken } = await register();

    const response = await request(app).get(url(ME)).set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data).toMatchObject({ email: asha.email, role: ROLES.USER });
    expect(response.body.data).not.toHaveProperty('passwordHash');
  });

  it('rejects a request without a token with UNAUTHORIZED', async () => {
    const response = await request(app).get(url(ME));

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(response.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });
});
