export const API_BASE_URL = '/api/v1';

export const API_PATHS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  USERS: '/users',
} as const;

export const AUTH_PATHS_WITHOUT_RETRY: readonly string[] = [
  API_PATHS.LOGIN,
  API_PATHS.REGISTER,
  API_PATHS.REFRESH,
  API_PATHS.LOGOUT,
];

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const ROLE_VALUES = Object.values(ROLES);

export type Role = (typeof ROLES)[keyof typeof ROLES];
