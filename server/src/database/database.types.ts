import type { RefreshTokensRepository } from '../modules/auth/refresh-tokens.repository.js';
import type { UsersRepository } from '../modules/users/users.repository.js';

export interface Repositories {
  users: UsersRepository;
  refreshTokens: RefreshTokensRepository;
}

export interface Database {
  repositories: Repositories;
  isReady(): Promise<boolean>;
  disconnect(): Promise<void>;
}
