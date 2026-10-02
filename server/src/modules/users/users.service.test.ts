import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { ERROR_CODES, ROLES } from '../../constants/index.js';
import { MemoryUsersRepository } from '../../database/memory/users.memory.js';
import { verifyPassword } from '../../lib/password.js';
import { createUsersService, type UsersService } from './users.service.js';

const asha = { name: 'Asha', email: 'asha@example.com', role: ROLES.USER };
const ravi = { name: 'Ravi', email: 'ravi@example.com', role: ROLES.ADMIN };
const PASSWORD = 'a-long-password';

let repo: MemoryUsersRepository;
let service: UsersService;

beforeEach(() => {
  repo = new MemoryUsersRepository();
  service = createUsersService(repo);
});

describe('create', () => {
  it('creates a user with an id and timestamps', async () => {
    const user = await service.create({ ...asha, password: PASSWORD });

    expect(user).toMatchObject(asha);
    expect(user.id).toBeTypeOf('string');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('never returns the password or its hash', async () => {
    const user = await service.create({ ...asha, password: PASSWORD });

    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('stores a hash that matches the password', async () => {
    await service.create({ ...asha, password: PASSWORD });

    const credentials = await repo.findCredentialsByEmail(asha.email);

    expect(credentials?.passwordHash).not.toBe(PASSWORD);
    expect(await verifyPassword(credentials?.passwordHash ?? '', PASSWORD)).toBe(true);
  });

  it('rejects a second user with the same email', async () => {
    await service.create({ ...asha, password: PASSWORD });

    await expect(
      service.create({ ...ravi, email: asha.email, password: PASSWORD }),
    ).rejects.toMatchObject({ code: ERROR_CODES.EMAIL_TAKEN });
  });
});

describe('getById', () => {
  it('returns an existing user', async () => {
    const created = await service.create({ ...asha, password: PASSWORD });

    expect(await service.getById(created.id)).toEqual(created);
  });

  it('fails with USER_NOT_FOUND for an unknown id', async () => {
    await expect(service.getById(randomUUID())).rejects.toMatchObject({
      code: ERROR_CODES.USER_NOT_FOUND,
    });
  });
});

describe('list', () => {
  it('returns one page of users, newest first, with the total', async () => {
    await service.create({ ...asha, password: PASSWORD });
    await service.create({ ...ravi, password: PASSWORD });

    const page = await service.list({ page: 1, limit: 1 });

    expect(page.total).toBe(2);
    expect(page.items.map((user) => user.email)).toEqual([ravi.email]);
  });

  it('returns an empty page past the end', async () => {
    await service.create({ ...asha, password: PASSWORD });

    expect(await service.list({ page: 5, limit: 10 })).toEqual({ items: [], total: 1 });
  });
});

describe('update', () => {
  it('changes only the given fields', async () => {
    const created = await service.create({ ...asha, password: PASSWORD });

    const updated = await service.update(created.id, { role: ROLES.ADMIN });

    expect(updated).toMatchObject({ ...asha, role: ROLES.ADMIN });
  });

  it('allows a user to keep their own email', async () => {
    const created = await service.create({ ...asha, password: PASSWORD });

    await expect(service.update(created.id, { email: asha.email })).resolves.toMatchObject(asha);
  });

  it("rejects taking another user's email", async () => {
    await service.create({ ...asha, password: PASSWORD });
    const second = await service.create({ ...ravi, password: PASSWORD });

    await expect(service.update(second.id, { email: asha.email })).rejects.toMatchObject({
      code: ERROR_CODES.EMAIL_TAKEN,
    });
  });

  it('fails with USER_NOT_FOUND for an unknown id', async () => {
    await expect(service.update(randomUUID(), { name: 'x' })).rejects.toMatchObject({
      code: ERROR_CODES.USER_NOT_FOUND,
    });
  });
});

describe('remove', () => {
  it('deletes the user', async () => {
    const created = await service.create({ ...asha, password: PASSWORD });

    await service.remove(created.id);

    await expect(service.getById(created.id)).rejects.toMatchObject({
      code: ERROR_CODES.USER_NOT_FOUND,
    });
  });

  it('fails with USER_NOT_FOUND for an unknown id', async () => {
    await expect(service.remove(randomUUID())).rejects.toMatchObject({
      code: ERROR_CODES.USER_NOT_FOUND,
    });
  });
});
