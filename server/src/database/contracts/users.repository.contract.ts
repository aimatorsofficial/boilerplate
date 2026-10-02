import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { ERROR_CODES, ROLES } from '../../constants/index.js';
import type { UsersRepository } from '../../modules/users/users.repository.js';

const asha = { name: 'Asha', email: 'asha@example.com', role: ROLES.USER, passwordHash: 'hash-a' };
const ravi = { name: 'Ravi', email: 'ravi@example.com', role: ROLES.ADMIN, passwordHash: 'hash-r' };
const PUBLIC_FIELDS = ['createdAt', 'email', 'id', 'name', 'role', 'updatedAt'];
const NEXT_TIMESTAMP_DELAY_MS = 5;

export const describeUsersRepositoryContract = (
  driverName: string,
  setup: () => Promise<UsersRepository>,
) => {
  describe(`${driverName} users repository`, () => {
    let repo: UsersRepository;

    beforeEach(async () => {
      repo = await setup();
    });

    it('creates a user with an id and timestamps, without the hash', async () => {
      const user = await repo.create(asha);

      expect(Object.keys(user).sort()).toEqual(PUBLIC_FIELDS);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('rejects a duplicate email with EMAIL_TAKEN', async () => {
      await repo.create(asha);

      await expect(repo.create({ ...ravi, email: asha.email })).rejects.toMatchObject({
        code: ERROR_CODES.EMAIL_TAKEN,
      });
    });

    it('finds a user by id and by email', async () => {
      const created = await repo.create(asha);

      expect(await repo.findById(created.id)).toEqual(created);
      expect(await repo.findByEmail(asha.email)).toEqual(created);
    });

    it('returns null for an unknown id or email', async () => {
      expect(await repo.findById(randomUUID())).toBeNull();
      expect(await repo.findByEmail('nobody@example.com')).toBeNull();
      expect(await repo.findCredentialsByEmail('nobody@example.com')).toBeNull();
    });

    it('returns the password hash only from findCredentialsByEmail', async () => {
      await repo.create(asha);

      expect(await repo.findCredentialsByEmail(asha.email)).toMatchObject({
        passwordHash: 'hash-a',
      });
    });

    it('lists users newest first with the total', async () => {
      await repo.create(asha);
      await new Promise((resolve) => setTimeout(resolve, NEXT_TIMESTAMP_DELAY_MS));
      await repo.create(ravi);

      const firstPage = await repo.list({ page: 1, limit: 1 });
      const secondPage = await repo.list({ page: 2, limit: 1 });

      expect(firstPage.total).toBe(2);
      expect(firstPage.items.map((user) => user.email)).toEqual([ravi.email]);
      expect(secondPage.items.map((user) => user.email)).toEqual([asha.email]);
      expect(Object.keys(firstPage.items[0] ?? {}).sort()).toEqual(PUBLIC_FIELDS);
    });

    it('updates only the given fields', async () => {
      const created = await repo.create(asha);

      const updated = await repo.update(created.id, { name: 'Asha K' });

      expect(updated).toMatchObject({ name: 'Asha K', email: asha.email, role: asha.role });
      expect(updated).not.toHaveProperty('passwordHash');
    });

    it('rejects an update to an email that is taken with EMAIL_TAKEN', async () => {
      await repo.create(asha);
      const second = await repo.create(ravi);

      await expect(repo.update(second.id, { email: asha.email })).rejects.toMatchObject({
        code: ERROR_CODES.EMAIL_TAKEN,
      });
    });

    it('returns null when updating an unknown id', async () => {
      expect(await repo.update(randomUUID(), { name: 'x' })).toBeNull();
    });

    it('deletes a user once', async () => {
      const created = await repo.create(asha);

      expect(await repo.delete(created.id)).toBe(true);
      expect(await repo.delete(created.id)).toBe(false);
      expect(await repo.findById(created.id)).toBeNull();
    });
  });
};
