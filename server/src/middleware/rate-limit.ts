import { rateLimit } from 'express-rate-limit';
import { ERROR_CODES, RATE_LIMIT, RATE_LIMIT_WINDOW_MS } from '../constants/index.js';
import { AppError } from '../lib/app-error.js';

const createRateLimit = (maxRequests: number) =>
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    limit: maxRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, _res, next) => next(new AppError(ERROR_CODES.TOO_MANY_REQUESTS)),
  });

export const createGeneralRateLimit = () => createRateLimit(RATE_LIMIT.GENERAL_MAX_REQUESTS);

export const createAuthRateLimit = () => createRateLimit(RATE_LIMIT.AUTH_MAX_REQUESTS);
