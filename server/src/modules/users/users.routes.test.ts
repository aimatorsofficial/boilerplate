import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import {
  API_PREFIX,
  API_ROUTES,
  ERROR_CODES,
  HTTP_STATUS,
  PAGINATION,
  ROLES,
} from '../../constants/index.js';
import { createMemoryDatabase } from '../../database/memory/index.js';
import { authHeaderFor } from '../auth/auth.test-support.js';

const USERS_URL = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;
const asha = { name: 'Asha', email: 'asha@example.com', password: 'a-long-password' };

let app: ReturnType<typeof createApp>;
let asAdmin: { Authorization: string };

const createUser = async (body: object = asha) => {
  const response = await request(app).post(USERS_URL).set(asAdmin).send(body);
  return response.body.data;
};

beforeAll(async () => {
  asAdmin = await authHeaderFor(ROLES.ADMIN);
});

beforeEach(() => {
  app = createApp(createMemoryDatabase());
});

describe('POST /users', () => {
  it('creates a user and returns it without internal fields', async () => {
    const response = await request(app)
      .post(USERS_URL)
      .set(asAdmin)
      .send({ ...asha, passwordHash: 'injected' });

    expect(response.status).toBe(HTTP_STATUS.CREATED);
    expect(Object.keys(response.body.data).sort()).toEqual([
      'createdAt',
      'email',
      'id',
      'name',
      'role',
      'updatedAt',
    ]);
  });

  it('lets an admin choose the role', async () => {
    const user = await createUser({ ...asha, role: ROLES.ADMIN });

    expect(user.role).toBe(ROLES.ADMIN);
  });

  it('stores the email in lower case', async () => {
    const user = await createUser({ ...asha, email: 'ASHA@Example.com' });

    expect(user.email).toBe('asha@example.com');
  });

  it('rejects a short password with VALIDATION_FAILED', async () => {
    const response = await request(app)
      .post(USERS_URL)
      .set(asAdmin)
      .send({ ...asha, password: 'short' });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it('rejects a duplicate email with EMAIL_TAKEN', async () => {
    await createUser();
    const response = await request(app).post(USERS_URL).set(asAdmin).send(asha);

    expect(response.status).toBe(HTTP_STATUS.CONFLICT);
    expect(response.body.error.code).toBe(ERROR_CODES.EMAIL_TAKEN);
  });
});

describe('GET /users', () => {
  it('returns a paginated list with meta', async () => {
    await createUser();

    const response = await request(app).get(USERS_URL).set(asAdmin);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta).toEqual({
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      total: 1,
      totalPages: 1,
    });
  });

  it('rejects a limit above the maximum with VALIDATION_FAILED', async () => {
    const response = await request(app)
      .get(USERS_URL)
      .set(asAdmin)
      .query({ limit: PAGINATION.MAX_LIMIT + 1 });

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('GET /users/:id', () => {
  it('returns the user', async () => {
    const user = await createUser();

    const response = await request(app).get(`${USERS_URL}/${user.id}`).set(asAdmin);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data).toEqual(user);
  });

  it('rejects an id that is not a UUID with VALIDATION_FAILED', async () => {
    const response = await request(app).get(`${USERS_URL}/123`).set(asAdmin);

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it('returns USER_NOT_FOUND for an unknown id', async () => {
    const response = await request(app).get(`${USERS_URL}/${randomUUID()}`).set(asAdmin);

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.error.code).toBe(ERROR_CODES.USER_NOT_FOUND);
  });
});

describe('PATCH /users/:id', () => {
  it('updates the given fields', async () => {
    const user = await createUser();

    const response = await request(app)
      .patch(`${USERS_URL}/${user.id}`)
      .set(asAdmin)
      .send({ name: 'Asha K', role: ROLES.ADMIN });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data).toMatchObject({ name: 'Asha K', role: ROLES.ADMIN });
  });

  it('rejects an empty body with VALIDATION_FAILED', async () => {
    const user = await createUser();

    const response = await request(app).patch(`${USERS_URL}/${user.id}`).set(asAdmin).send({});

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it('returns USER_NOT_FOUND for an unknown id', async () => {
    const response = await request(app)
      .patch(`${USERS_URL}/${randomUUID()}`)
      .set(asAdmin)
      .send({ name: 'x' });

    expect(response.body.error.code).toBe(ERROR_CODES.USER_NOT_FOUND);
  });
});

describe('DELETE /users/:id', () => {
  it('deletes the user and returns no content', async () => {
    const user = await createUser();

    const response = await request(app).delete(`${USERS_URL}/${user.id}`).set(asAdmin);

    expect(response.status).toBe(HTTP_STATUS.NO_CONTENT);
  });

  it('returns USER_NOT_FOUND for an unknown id', async () => {
    const response = await request(app).delete(`${USERS_URL}/${randomUUID()}`).set(asAdmin);

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.error.code).toBe(ERROR_CODES.USER_NOT_FOUND);
  });
});
