import type { ErrorRequestHandler } from 'express';
import { ERROR_CODES, type ErrorCode } from '../constants/index.js';
import { AppError } from '../lib/app-error.js';
import { sendError } from '../lib/response.js';
import { reportError } from '../monitoring/sentry.js';

const BODY_PARSER_ERROR_CODES: Record<string, ErrorCode> = {
  'entity.parse.failed': ERROR_CODES.INVALID_JSON,
  'entity.too.large': ERROR_CODES.PAYLOAD_TOO_LARGE,
};

const readBodyParserErrorCode = (error: unknown): ErrorCode | undefined => {
  if (!(error instanceof Error) || !('type' in error) || typeof error.type !== 'string') {
    return undefined;
  }
  return BODY_PARSER_ERROR_CODES[error.type];
};

const toAppError = (error: unknown): AppError | undefined => {
  if (error instanceof AppError) return error;
  const bodyParserCode = readBodyParserErrorCode(error);
  return bodyParserCode ? new AppError(bodyParserCode) : undefined;
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const appError = toAppError(error);
  if (appError) {
    sendError(res, appError, String(req.id));
    return;
  }

  req.log.error({ err: error }, 'Unhandled error');
  reportError(error, String(req.id));
  sendError(res, new AppError(ERROR_CODES.INTERNAL_ERROR), String(req.id));
};
