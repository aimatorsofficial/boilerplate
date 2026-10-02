import { randomUUID } from 'node:crypto';
import { ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../../lib/app-error.js';
import { toSkip, type PaginationQuery } from '../../lib/pagination.js';
import type { UsersRepository } from '../../modules/users/users.repository.js';
import type {
  NewUserRecord,
  UpdateUserInput,
  User,
  UserCredentials,
} from '../../modules/users/users.schema.js';

const toPublicUser = ({ passwordHash: _passwordHash, ...user }: UserCredentials): User =>
  structuredClone(user);

export class MemoryUsersRepository implements UsersRepository {
  private readonly usersById = new Map<string, UserCredentials>();

  private assertEmailIsUnique(email: string, ownerId?: string) {
    const owner = [...this.usersById.values()].find((user) => user.email === email);
    if (owner && owner.id !== ownerId) throw new AppError(ERROR_CODES.EMAIL_TAKEN);
  }

  async create(input: NewUserRecord) {
    this.assertEmailIsUnique(input.email);
    const now = new Date();
    const user: UserCredentials = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
    this.usersById.set(user.id, user);
    return toPublicUser(user);
  }

  async findById(id: string) {
    const user = this.usersById.get(id);
    return user ? toPublicUser(user) : null;
  }

  async findByEmail(email: string) {
    const user = await this.findCredentialsByEmail(email);
    return user ? toPublicUser(user) : null;
  }

  async findCredentialsByEmail(email: string) {
    const user = [...this.usersById.values()].find((candidate) => candidate.email === email);
    return user ? structuredClone(user) : null;
  }

  async list(query: PaginationQuery) {
    const newestFirst = [...this.usersById.values()].reverse();
    const start = toSkip(query);
    const items = newestFirst.slice(start, start + query.limit).map(toPublicUser);
    return { items, total: this.usersById.size };
  }

  async update(id: string, input: UpdateUserInput) {
    const existing = this.usersById.get(id);
    if (!existing) return null;
    if (input.email) this.assertEmailIsUnique(input.email, id);
    const updated: UserCredentials = { ...existing, ...input, updatedAt: new Date() };
    this.usersById.set(id, updated);
    return toPublicUser(updated);
  }

  async delete(id: string) {
    return this.usersById.delete(id);
  }
}
