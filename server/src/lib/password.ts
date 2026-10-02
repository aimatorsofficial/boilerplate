import { argon2id, hash, verify } from 'argon2';
import { PASSWORD_HASHING } from '../constants/index.js';

const HASH_OPTIONS = {
  type: argon2id,
  memoryCost: PASSWORD_HASHING.MEMORY_COST_KIB,
  timeCost: PASSWORD_HASHING.TIME_COST,
  parallelism: PASSWORD_HASHING.PARALLELISM,
} as const;

export const hashPassword = (password: string) => hash(password, HASH_OPTIONS);

export const verifyPassword = (passwordHash: string, password: string) =>
  verify(passwordHash, password);
