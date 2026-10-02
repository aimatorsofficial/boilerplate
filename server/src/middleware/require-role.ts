import type { RequestHandler } from 'express';
import { ERROR_CODES, type Role } from '../constants/index.js';
import { AppError } from '../lib/app-error.js';
import { getAuth } from './auth.js';

export const requireRole =
  (...allowedRoles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!allowedRoles.includes(getAuth(req).role)) throw new AppError(ERROR_CODES.FORBIDDEN);
    next();
  };
