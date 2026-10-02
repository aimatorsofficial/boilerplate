import { ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../../lib/app-error.js';
import type { PaginationQuery } from '../../lib/pagination.js';
import { hashPassword } from '../../lib/password.js';
import type { UsersRepository } from './users.repository.js';
import type { CreateUserInput, UpdateUserInput } from './users.schema.js';

export const createUsersService = (repo: UsersRepository) => {
  const assertEmailIsFree = async (email: string, ownerId?: string) => {
    const existing = await repo.findByEmail(email);
    if (existing && existing.id !== ownerId) throw new AppError(ERROR_CODES.EMAIL_TAKEN);
  };

  const getById = async (id: string) => {
    const user = await repo.findById(id);
    if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    return user;
  };

  return {
    getById,

    list: (query: PaginationQuery) => repo.list(query),

    async create({ password, ...profile }: CreateUserInput) {
      await assertEmailIsFree(profile.email);
      return repo.create({ ...profile, passwordHash: await hashPassword(password) });
    },

    async update(id: string, input: UpdateUserInput) {
      await getById(id);
      if (input.email) await assertEmailIsFree(input.email, id);
      const updated = await repo.update(id, input);
      if (!updated) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
      return updated;
    },

    async remove(id: string) {
      const deleted = await repo.delete(id);
      if (!deleted) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    },
  };
};

export type UsersService = ReturnType<typeof createUsersService>;
