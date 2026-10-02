import type { UsersRepository } from '../modules/users/users.repository.js';
import { createMemoryUsersRepository } from './memory/users.memory.js';

export interface Repositories {
  users: UsersRepository;
}

export const createRepositories = (): Repositories => ({
  users: createMemoryUsersRepository(),
});
