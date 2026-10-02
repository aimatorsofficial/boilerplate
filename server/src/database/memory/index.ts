import type { Database } from '../database.types.js';
import { MemoryRefreshTokensRepository } from './refresh-tokens.memory.js';
import { MemoryUsersRepository } from './users.memory.js';

export const createMemoryDatabase = (): Database => ({
  repositories: {
    users: new MemoryUsersRepository(),
    refreshTokens: new MemoryRefreshTokensRepository(),
  },
  isReady: () => Promise.resolve(true),
  disconnect: () => Promise.resolve(),
});
