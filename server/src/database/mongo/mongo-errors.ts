import { mongo } from 'mongoose';
import { MONGO_DUPLICATE_KEY_ERROR } from '../../constants/index.js';

export const isDuplicateKeyError = (error: unknown) =>
  error instanceof mongo.MongoServerError && error.code === MONGO_DUPLICATE_KEY_ERROR;
