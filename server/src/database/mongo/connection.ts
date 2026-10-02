import mongoose from 'mongoose';
import { MONGO_SERVER_SELECTION_TIMEOUT_MS } from '../../constants/index.js';

export const connectMongo = async (uri: string) => {
  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: MONGO_SERVER_SELECTION_TIMEOUT_MS });
  await mongoose.connection.syncIndexes();
};

export const disconnectMongo = () => mongoose.disconnect();

export const isMongoReady = async () => {
  const db = mongoose.connection.db;
  if (!db) return false;
  try {
    await db.admin().ping();
    return true;
  } catch {
    return false;
  }
};
