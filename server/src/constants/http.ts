export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const HTTP_HEADERS = {
  REQUEST_ID: 'x-request-id',
  AUTHORIZATION: 'authorization',
} as const;

export const BEARER_PREFIX = 'Bearer ';

export const REQUEST_ID_PATTERN = /^[\w-]{1,64}$/;
