import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { HTTP_HEADERS, REQUEST_ID_PATTERN } from '../constants/index.js';

const readTrustedRequestId = (header: string | undefined) =>
  header && REQUEST_ID_PATTERN.test(header) ? header : undefined;

export const requestId: RequestHandler = (req, res, next) => {
  const id = readTrustedRequestId(req.get(HTTP_HEADERS.REQUEST_ID)) ?? randomUUID();
  req.id = id;
  res.setHeader(HTTP_HEADERS.REQUEST_ID, id);
  next();
};
