import { Router } from 'express';
import { ERROR_CODES, HEALTH_STATUS, SYSTEM_ROUTES } from '../constants/index.js';
import type { Database } from '../database/index.js';
import { AppError } from '../lib/app-error.js';
import { sendOk } from '../lib/response.js';

export const createReadyRouter = (isDatabaseReady: Database['isReady']) => {
  const router = Router();

  router.get(SYSTEM_ROUTES.READY, async (_req, res) => {
    if (!(await isDatabaseReady())) throw new AppError(ERROR_CODES.DATABASE_UNAVAILABLE);
    sendOk(res, { status: HEALTH_STATUS.OK });
  });

  return router;
};
