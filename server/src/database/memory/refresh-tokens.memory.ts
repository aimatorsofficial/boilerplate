import type {
  RefreshTokenRecord,
  RefreshTokensRepository,
} from '../../modules/auth/refresh-tokens.repository.js';

export class MemoryRefreshTokensRepository implements RefreshTokensRepository {
  private readonly recordsByHash = new Map<string, RefreshTokenRecord>();

  async create(record: RefreshTokenRecord) {
    this.recordsByHash.set(record.tokenHash, structuredClone(record));
  }

  async consume(tokenHash: string) {
    const record = this.recordsByHash.get(tokenHash);
    this.recordsByHash.delete(tokenHash);
    return record ?? null;
  }
}
