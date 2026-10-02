import type { ResponseConfig, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { z, type ZodType } from 'zod';
import { HTTP_STATUS } from '../constants/index.js';

const JSON_CONTENT_TYPE = 'application/json';

const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    details: z.array(z.object({ path: z.string(), code: z.string() })).optional(),
  }),
  requestId: z.string(),
});

const pageMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});

const jsonContent = (schema: ZodType) => ({ [JSON_CONTENT_TYPE]: { schema } });

export const toOpenApiPath = (expressPath: string) => expressPath.replace(/:(\w+)/g, '{$1}');

export const jsonBody = (schema: ZodType): ZodRequestBody => ({
  required: true,
  content: jsonContent(schema),
});

export const dataResponse = (description: string, schema: ZodType): ResponseConfig => ({
  description,
  content: jsonContent(z.object({ data: schema })),
});

export const listResponse = (description: string, itemSchema: ZodType): ResponseConfig => ({
  description,
  content: jsonContent(z.object({ data: z.array(itemSchema), meta: pageMetaSchema })),
});

export const emptyResponse = (description: string): ResponseConfig => ({ description });

export const errorResponse = (description: string): ResponseConfig => ({
  description,
  content: jsonContent(errorResponseSchema),
});

export const BEARER_AUTH = 'bearerAuth';

export const bearerSecurity = [{ [BEARER_AUTH]: [] }];

export const invalidInputResponse = errorResponse('Invalid input (VALIDATION_FAILED)');

export const signedInResponses = {
  [HTTP_STATUS.UNAUTHORIZED]: errorResponse('Missing or invalid access token (UNAUTHORIZED)'),
};

export const adminOnlyResponses = {
  ...signedInResponses,
  [HTTP_STATUS.FORBIDDEN]: errorResponse('Admin role required (FORBIDDEN)'),
};
