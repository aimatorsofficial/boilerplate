import type { Role } from '../../constants/index.js';
import { signAccessToken } from './auth.tokens.js';

export const authHeaderFor = async (role: Role, userId = `${role}-1`) => ({
  Authorization: `Bearer ${await signAccessToken({ userId, role })}`,
});
