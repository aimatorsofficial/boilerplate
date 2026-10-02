import { Router } from 'express';
import { METRICS } from '../constants/index.js';

export const createApiRouter = () => {
  const router = Router();
  router.use((req, res, next) => {
    res.locals[METRICS.ROUTE_BASE_LOCAL] = req.baseUrl;
    next();
  });
  return router;
};
