import type { Page, PaginationQuery } from '../../lib/pagination.js';
import type { CreateUserInput, UpdateUserInput, User } from './users.schema.js';

export interface UsersRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(query: PaginationQuery): Promise<Page<User>>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
