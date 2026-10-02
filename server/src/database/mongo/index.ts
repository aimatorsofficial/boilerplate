import type { Database } from '../database.types.js';
import { connectMongo, disconnectMongo, isMongoReady } from './connection.js';
import { MongoRefreshTokensRepository } from './refresh-tokens.mongo.js';
import { MongoUsersRepository } from './users.mongo.js';

export const createMongoDatabase = async (uri: string): Promise<Database> => {
  await connectMongo(uri);
  return {
    repositories: {
      users: new MongoUsersRepository(),
      refreshTokens: new MongoRefreshTokensRepository(),
    },
    isReady: isMongoReady,
    disconnect: disconnectMongo,
  };
};
