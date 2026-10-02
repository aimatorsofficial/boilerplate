export const METRICS = {
  HTTP_DURATION_NAME: 'http_request_duration_seconds',
  HTTP_DURATION_HELP: 'Duration of HTTP requests in seconds',
  DURATION_BUCKETS_SECONDS: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  UNMATCHED_ROUTE: 'unmatched',
  ROUTE_BASE_LOCAL: 'routeBase',
} as const;

export const SENTRY = {
  FLUSH_TIMEOUT_MS: 2000,
} as const;
