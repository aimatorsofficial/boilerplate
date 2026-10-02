export interface RefreshTokenRecord {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

export interface RefreshTokensRepository {
  create(record: RefreshTokenRecord): Promise<void>;
  consume(tokenHash: string): Promise<RefreshTokenRecord | null>;
}
