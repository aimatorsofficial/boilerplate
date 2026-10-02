import type { RequestHandler } from 'express';
import type { z, ZodError, ZodType } from 'zod';
import { ERROR_CODES } from '../constants/index.js';
import { AppError, type ErrorDetail } from '../lib/app-error.js';

const REQUEST_PARTS = ['params', 'query', 'body'] as const;

type RequestPart = (typeof REQUEST_PARTS)[number];

type RequestSchemas = Partial<Record<RequestPart, ZodType>>;

type Parsed<S extends RequestSchemas, Part extends RequestPart, Fallback> = S[Part] extends ZodType
  ? z.output<S[Part]>
  : Fallback;

type ValidatedHandler<S extends RequestSchemas> = RequestHandler<
  Parsed<S, 'params', Record<string, string>>,
  unknown,
  Parsed<S, 'body', unknown>,
  Parsed<S, 'query', unknown>
>;

const toErrorDetails = (part: RequestPart, error: ZodError): ErrorDetail[] =>
  error.issues.map((issue) => ({
    path: [part, ...issue.path.map(String)].join('.'),
    code: issue.code,
  }));

export const validate =
  <S extends RequestSchemas>(schemas: S): ValidatedHandler<S> =>
  (req, _res, next) => {
    const details: ErrorDetail[] = [];

    for (const part of REQUEST_PARTS) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (result.success) {
        Object.defineProperty(req, part, { value: result.data, writable: true, enumerable: true });
      } else {
        details.push(...toErrorDetails(part, result.error));
      }
    }

    if (details.length > 0) throw new AppError(ERROR_CODES.VALIDATION_FAILED, details);
    next();
  };
