import { beforeEach, describe, expect, it } from 'vitest';
import type { RefreshTokensRepository } from '../../modules/auth/refresh-tokens.repository.js';

const record = {
  tokenHash: 'hash-1',
  userId: 'user-1',
  expiresAt: new Date('2030-01-01T00:00:00.000Z'),
};

export const describeRefreshTokensRepositoryContract = (
  driverName: string,
  setup: () => Promise<RefreshTokensRepository>,
) => {
  describe(`${driverName} refresh tokens repository`, () => {
    let repo: RefreshTokensRepository;

    beforeEach(async () => {
      repo = await setup();
    });

    it('returns a stored record exactly once', async () => {
      await repo.create(record);

      expect(await repo.consume(record.tokenHash)).toEqual(record);
      expect(await repo.consume(record.tokenHash)).toBeNull();
    });

    it('returns null for an unknown hash', async () => {
      expect(await repo.consume('unknown')).toBeNull();
    });
  });
};
