import { DB_DRIVERS, type DbDriver } from '../constants/index.js';
import type { Database } from './database.types.js';
import { createMemoryDatabase } from './memory/index.js';
import { createMongoDatabase } from './mongo/index.js';

export type { Database, Repositories } from './database.types.js';

export const createDatabase = async (driver: DbDriver, mongoUri?: string): Promise<Database> => {
  if (driver === DB_DRIVERS.MEMORY) return createMemoryDatabase();
  if (!mongoUri) throw new Error('MONGO_URI is required when DB_DRIVER is mongo');
  return createMongoDatabase(mongoUri);
};
