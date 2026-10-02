import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { API_PREFIX, API_ROUTES, HTTP_STATUS, SYSTEM_ROUTES } from '../constants/index.js';
import { createRepositories } from '../database/index.js';
import { buildOpenApiDocument } from './swagger.js';

const USERS_PATH = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;

describe('OpenAPI document', () => {
  it('describes every users endpoint', () => {
    const { paths = {} } = buildOpenApiDocument();

    expect(Object.keys(paths[USERS_PATH] ?? {})).toEqual(['get', 'post']);
    expect(Object.keys(paths[`${USERS_PATH}/{id}`] ?? {})).toEqual(['get', 'patch', 'delete']);
  });

  it('exposes the User schema as a reusable component', () => {
    expect(buildOpenApiDocument().components?.schemas).toHaveProperty('User');
  });
});

describe('docs routes', () => {
  const app = createApp(createRepositories());

  it('serves the OpenAPI JSON', async () => {
    const response = await request(app).get(SYSTEM_ROUTES.OPENAPI_JSON);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.paths).toHaveProperty(USERS_PATH);
  });

  it('serves the Swagger UI page', async () => {
    const response = await request(app).get(`${SYSTEM_ROUTES.DOCS}/`);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toMatch(/html/);
  });
});
