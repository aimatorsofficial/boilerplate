export const API_PREFIX = '/api/v1';

export const SYSTEM_ROUTES = {
  HEALTH: '/health',
  DOCS: '/docs',
  OPENAPI_JSON: '/docs/openapi.json',
} as const;

export const API_ROUTES = {
  USERS: {
    ROOT: '/users',
    BY_ID: '/:id',
  },
} as const;
