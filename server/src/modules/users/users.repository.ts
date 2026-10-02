import type { Page, PaginationQuery } from '../../lib/pagination.js';
import type { NewUserRecord, UpdateUserInput, User, UserCredentials } from './users.schema.js';

export interface UsersRepository {
  create(input: NewUserRecord): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  list(query: PaginationQuery): Promise<Page<User>>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
