import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { describeRefreshTokensRepositoryContract } from '../contracts/refresh-tokens.repository.contract.js';
import { describeUsersRepositoryContract } from '../contracts/users.repository.contract.js';
import { connectMongo, disconnectMongo, isMongoReady } from './connection.js';
import { RefreshTokenModel } from './refresh-tokens.model.js';
import { MongoRefreshTokensRepository } from './refresh-tokens.mongo.js';
import { UserModel } from './users.model.js';
import { MongoUsersRepository } from './users.mongo.js';

const MONGO_STARTUP_TIMEOUT_MS = 120_000;

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectMongo(mongoServer.getUri());
}, MONGO_STARTUP_TIMEOUT_MS);

afterAll(async () => {
  await disconnectMongo();
  await mongoServer.stop();
});

describeUsersRepositoryContract('mongo', async () => {
  await UserModel.deleteMany({});
  return new MongoUsersRepository();
});

describeRefreshTokensRepositoryContract('mongo', async () => {
  await RefreshTokenModel.deleteMany({});
  return new MongoRefreshTokensRepository();
});

describe('mongo connection', () => {
  it('reports ready while connected', async () => {
    expect(await isMongoReady()).toBe(true);
  });
});
