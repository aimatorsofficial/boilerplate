import { randomUUID } from 'node:crypto';
import { toSkip } from '../../lib/pagination.js';
import type { UsersRepository } from '../../modules/users/users.repository.js';
import type { User } from '../../modules/users/users.schema.js';

export const createMemoryUsersRepository = (): UsersRepository => {
  const usersById = new Map<string, User>();

  const copyOrNull = (user: User | undefined) => (user ? structuredClone(user) : null);

  return {
    async create(input) {
      const now = new Date();
      const user: User = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
      usersById.set(user.id, user);
      return structuredClone(user);
    },

    async findById(id) {
      return copyOrNull(usersById.get(id));
    },

    async findByEmail(email) {
      return copyOrNull([...usersById.values()].find((user) => user.email === email));
    },

    async list(query) {
      const newestFirst = [...usersById.values()].reverse();
      const start = toSkip(query);
      const items = newestFirst
        .slice(start, start + query.limit)
        .map((user) => structuredClone(user));
      return { items, total: usersById.size };
    },

    async update(id, input) {
      const existing = usersById.get(id);
      if (!existing) return null;
      const updated: User = { ...existing, ...input, updatedAt: new Date() };
      usersById.set(id, updated);
      return structuredClone(updated);
    },

    async delete(id) {
      return usersById.delete(id);
    },
  };
};
