import { model, Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../../constants/index.js';
import type { RefreshTokenRecord } from '../../modules/auth/refresh-tokens.repository.js';

const refreshTokenSchema = new Schema<RefreshTokenRecord>(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { collection: COLLECTION_NAMES.REFRESH_TOKENS, versionKey: false },
);

export const RefreshTokenModel = model<RefreshTokenRecord>('RefreshToken', refreshTokenSchema);
