const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const DAY_MS = 24 * 60 * MINUTE_MS;

export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH_MS: 7 * DAY_MS,
} as const;

export const RATE_LIMIT_WINDOW_MS = 15 * MINUTE_MS;
