import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ERROR_CODES, HTTP_STATUS } from '../constants/index.js';
import { errorHandler } from './error-handler.js';
import { validate } from './validate.js';

const buildTestApp = () => {
  const app = express();
  app.use(express.json());
  app.post(
    '/items/:id',
    validate({
      params: z.object({ id: z.string().min(2) }),
      query: z.object({ count: z.coerce.number().default(1) }),
      body: z.object({ name: z.string().trim() }),
    }),
    (req, res) => {
      res.json({ params: req.params, query: req.query, body: req.body });
    },
  );
  app.use(errorHandler);
  return app;
};

describe('validate middleware', () => {
  it('replaces params, query and body with the parsed values', async () => {
    const response = await request(buildTestApp())
      .post('/items/ab?count=3')
      .send({ name: '  Asha  ', extra: true });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body).toEqual({
      params: { id: 'ab' },
      query: { count: 3 },
      body: { name: 'Asha' },
    });
  });

  it('rejects invalid input with VALIDATION_FAILED and the failing paths', async () => {
    const response = await request(buildTestApp()).post('/items/a').send({});

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
    expect(response.body.error.details.map((detail: { path: string }) => detail.path)).toEqual([
      'params.id',
      'body.name',
    ]);
  });
});
