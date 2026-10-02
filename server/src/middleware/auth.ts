import type { Request, RequestHandler } from 'express';
import { BEARER_PREFIX, ERROR_CODES, HTTP_HEADERS } from '../constants/index.js';
import { AppError } from '../lib/app-error.js';
import type { AuthContext } from '../modules/auth/auth.schema.js';
import { verifyAccessToken } from '../modules/auth/auth.tokens.js';

export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.get(HTTP_HEADERS.AUTHORIZATION);
  if (!header?.startsWith(BEARER_PREFIX)) throw new AppError(ERROR_CODES.UNAUTHORIZED);

  req.auth = await verifyAccessToken(header.slice(BEARER_PREFIX.length));
  next();
};

export const getAuth = (req: Request): AuthContext => {
  if (!req.auth) throw new AppError(ERROR_CODES.UNAUTHORIZED);
  return req.auth;
};
