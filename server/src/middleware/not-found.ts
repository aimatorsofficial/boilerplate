import type { RequestHandler } from 'express';
import { ERROR_CODES } from '../constants/index.js';
import { AppError } from '../lib/app-error.js';

export const notFound: RequestHandler = () => {
  throw new AppError(ERROR_CODES.ROUTE_NOT_FOUND);
};
