import type {
  RefreshTokenRecord,
  RefreshTokensRepository,
} from '../../modules/auth/refresh-tokens.repository.js';
import { RefreshTokenModel } from './refresh-tokens.model.js';

export class MongoRefreshTokensRepository implements RefreshTokensRepository {
  async create(record: RefreshTokenRecord) {
    await RefreshTokenModel.create(record);
  }

  async consume(tokenHash: string) {
    const doc = await RefreshTokenModel.findOneAndDelete({ tokenHash }).lean<RefreshTokenRecord>();
    return doc ? { tokenHash: doc.tokenHash, userId: doc.userId, expiresAt: doc.expiresAt } : null;
  }
}
