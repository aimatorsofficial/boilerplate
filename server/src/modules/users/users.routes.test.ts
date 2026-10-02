import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import {
  API_PREFIX,
  API_ROUTES,
  ERROR_CODES,
  HTTP_STATUS,
  PAGINATION,
} from '../../constants/index.js';
import { createRepositories } from '../../database/index.js';

const USERS_URL = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;
const asha = { name: 'Asha', email: 'asha@example.com' };

let app: ReturnType<typeof createApp>;

const createUser = async (body = asha) => {
  const response = await request(app).post(USERS_URL).send(body);
  return response.body.data;
};

beforeEach(() => {
  app = createApp(createRepositories());
});

describe('POST /users', () => {
  it('creates a user and returns it without internal fields', async () => {
    const response = await request(app)
      .post(USERS_URL)
      .send({ ...asha, role: 'admin' });

    expect(response.status).toBe(HTTP_STATUS.CREATED);
    expect(Object.keys(response.body.data).sort()).toEqual([
      'createdAt',
      'email',
      'id',
      'name',
      'updatedAt',
    ]);
  });

  it('stores the email in lower case', async () => {
    const user = await createUser({ name: 'Asha', email: 'ASHA@Example.com' });

    expect(user.email).toBe('asha@example.com');
  });

  it('rejects an invalid email with VALIDATION_FAILED', async () => {
    const response = await request(app).post(USERS_URL).send({ name: 'Asha', email: 'nope' });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it('rejects a duplicate email with EMAIL_TAKEN', async () => {
    await createUser();
    const response = await request(app).post(USERS_URL).send(asha);

    expect(response.status).toBe(HTTP_STATUS.CONFLICT);
    expect(response.body.error.code).toBe(ERROR_CODES.EMAIL_TAKEN);
  });
});

describe('GET /users', () => {
  it('returns a paginated list with meta', async () => {
    await createUser();

    const response = await request(app).get(USERS_URL);

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
      .query({ limit: PAGINATION.MAX_LIMIT + 1 });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});

describe('GET /users/:id', () => {
  it('returns the user', async () => {
    const user = await createUser();

    const response = await request(app).get(`${USERS_URL}/${user.id}`);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data).toEqual(user);
  });

  it('rejects an id that is not a UUID with VALIDATION_FAILED', async () => {
    const response = await request(app).get(`${USERS_URL}/123`);

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it('returns USER_NOT_FOUND for an unknown id', async () => {
    const response = await request(app).get(`${USERS_URL}/${randomUUID()}`);

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.error.code).toBe(ERROR_CODES.USER_NOT_FOUND);
  });
});

describe('PATCH /users/:id', () => {
  it('updates the given fields', async () => {
    const user = await createUser();

    const response = await request(app).patch(`${USERS_URL}/${user.id}`).send({ name: 'Asha K' });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.data.name).toBe('Asha K');
  });

  it('rejects an empty body with VALIDATION_FAILED', async () => {
    const user = await createUser();

    const response = await request(app).patch(`${USERS_URL}/${user.id}`).send({});

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it('returns USER_NOT_FOUND for an unknown id', async () => {
    const response = await request(app).patch(`${USERS_URL}/${randomUUID()}`).send({ name: 'x' });

    expect(response.body.error.code).toBe(ERROR_CODES.USER_NOT_FOUND);
  });
});

describe('DELETE /users/:id', () => {
  it('deletes the user and returns no content', async () => {
    const user = await createUser();

    const response = await request(app).delete(`${USERS_URL}/${user.id}`);

    expect(response.status).toBe(HTTP_STATUS.NO_CONTENT);
  });

  it('returns USER_NOT_FOUND for an unknown id', async () => {
    const response = await request(app).delete(`${USERS_URL}/${randomUUID()}`);

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.error.code).toBe(ERROR_CODES.USER_NOT_FOUND);
  });

  it('rejects an id that is not a UUID with VALIDATION_FAILED', async () => {
    const response = await request(app).delete(`${USERS_URL}/abc`);

    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });
});
