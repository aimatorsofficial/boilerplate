export const DB_DRIVERS = {
  MEMORY: 'memory',
  MONGO: 'mongo',
} as const;

export type DbDriver = (typeof DB_DRIVERS)[keyof typeof DB_DRIVERS];

export const DB_DRIVER_VALUES = Object.values(DB_DRIVERS);

export const MONGO_SERVER_SELECTION_TIMEOUT_MS = 5000;

export const COLLECTION_NAMES = {
  USERS: 'users',
  REFRESH_TOKENS: 'refresh_tokens',
} as const;

export const MONGO_DUPLICATE_KEY_ERROR = 11000;
