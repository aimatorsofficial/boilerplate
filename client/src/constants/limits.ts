export const PAGINATION = {
  FIRST_PAGE: 1,
  PAGE_SIZE: 20,
} as const;

export const PASSWORD_MIN_LENGTH = 8;

export const QUERY_SETTINGS = {
  STALE_TIME_MS: 30_000,
  MAX_RETRIES: 1,
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  CLIENT_ERROR_MIN: 400,
  SERVER_ERROR_MIN: 500,
} as const;
