import { z } from 'zod';
import { PASSWORD_LIMITS, TOKEN_LIMITS, type Role } from '../../constants/index.js';
import { userFieldSchemas } from '../users/users.schema.js';

export const registerBodySchema = z.object({
  name: userFieldSchemas.name,
  email: userFieldSchemas.email,
  password: userFieldSchemas.password,
});

export const loginBodySchema = z.object({
  email: userFieldSchemas.email,
  password: z.string().min(1).max(PASSWORD_LIMITS.MAX_LENGTH),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1).max(TOKEN_LIMITS.REFRESH_TOKEN_MAX_LENGTH),
});

export const tokenPairResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenBodySchema>;
export type TokenPair = z.infer<typeof tokenPairResponseSchema>;

export interface AuthContext {
  userId: string;
  role: Role;
}
