import { Router } from 'express';
import { HEALTH_STATUS, SYSTEM_ROUTES } from '../constants/index.js';
import { sendOk } from '../lib/response.js';

export const healthRouter = Router();

healthRouter.get(SYSTEM_ROUTES.HEALTH, (_req, res) => {
  sendOk(res, { status: HEALTH_STATUS.OK, uptimeSeconds: Math.floor(process.uptime()) });
});
