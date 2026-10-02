import { beforeEach, describe, expect, it } from 'vitest';
import { ROLES } from '../../constants/index.js';
import { MemoryUsersRepository } from '../../database/memory/users.memory.js';
import { seedAdmin, seedAdminInputSchema } from './users.seed.js';
import { createUsersService, type UsersService } from './users.service.js';

const admin = { name: 'Admin', email: 'admin@example.com', password: 'a-long-password' };

let repo: MemoryUsersRepository;
let service: UsersService;

beforeEach(() => {
  repo = new MemoryUsersRepository();
  service = createUsersService(repo);
});

describe('seedAdmin', () => {
  it('creates an admin when the email is new', async () => {
    const result = await seedAdmin(service, repo, admin);

    expect(result.created).toBe(true);
    expect(result.user.role).toBe(ROLES.ADMIN);
  });

  it('does nothing the second time', async () => {
    await seedAdmin(service, repo, admin);

    const result = await seedAdmin(service, repo, admin);

    expect(result.created).toBe(false);
    expect((await repo.list({ page: 1, limit: 10 })).total).toBe(1);
  });

  it('promotes an existing normal user to admin', async () => {
    await service.create({ ...admin, role: ROLES.USER });

    const result = await seedAdmin(service, repo, admin);

    expect(result).toMatchObject({ created: false, user: { role: ROLES.ADMIN } });
  });
});

describe('seedAdminInputSchema', () => {
  it('rejects missing seed values', () => {
    expect(seedAdminInputSchema.safeParse({ name: 'Admin' }).success).toBe(false);
  });
});
