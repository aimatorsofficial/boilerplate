import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ERROR_CODES, HTTP_STATUS } from '../constants/index.js';
import { AppError } from '../lib/app-error.js';
import { reportError } from '../monitoring/sentry.js';
import { errorHandler } from './error-handler.js';
import { requestId } from './request-id.js';

vi.mock('../monitoring/sentry.js', () => ({ reportError: vi.fn() }));

const buildTestApp = (error: unknown) => {
  const app = express();
  app.use(requestId);
  app.use((req, _res, next) => {
    req.log = Object.assign(Object.create(null), { error: vi.fn() });
    next();
  });
  app.get('/fail', () => {
    throw error;
  });
  app.use(errorHandler);
  return app;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('errorHandler', () => {
  it('hides unexpected errors behind INTERNAL_ERROR and reports them', async () => {
    const response = await request(buildTestApp(new Error('database password is hunter2'))).get(
      '/fail',
    );

    expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(response.body.error).toEqual({ code: ERROR_CODES.INTERNAL_ERROR });
    expect(JSON.stringify(response.body)).not.toContain('hunter2');
    expect(reportError).toHaveBeenCalledWith(expect.any(Error), response.body.requestId);
  });

  it('does not report expected errors', async () => {
    const response = await request(buildTestApp(new AppError(ERROR_CODES.USER_NOT_FOUND))).get(
      '/fail',
    );

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(reportError).not.toHaveBeenCalled();
  });
});
