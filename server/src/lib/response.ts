import type { Response } from 'express';
import { HTTP_STATUS } from '../constants/index.js';
import type { AppError } from './app-error.js';
import type { PageMeta } from './pagination.js';

export const sendOk = <T>(res: Response, data: T) => {
  res.status(HTTP_STATUS.OK).json({ data });
};

export const sendCreated = <T>(res: Response, data: T) => {
  res.status(HTTP_STATUS.CREATED).json({ data });
};

export const sendList = <T>(res: Response, data: T[], meta: PageMeta) => {
  res.status(HTTP_STATUS.OK).json({ data, meta });
};

export const sendNoContent = (res: Response) => {
  res.status(HTTP_STATUS.NO_CONTENT).end();
};

export const sendError = (res: Response, error: AppError, requestId: string) => {
  res.status(error.status).json({
    error: { code: error.code, details: error.details },
    requestId,
  });
};
