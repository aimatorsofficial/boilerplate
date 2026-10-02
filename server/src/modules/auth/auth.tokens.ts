import { createHash, randomBytes } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';
import { env } from '../../config/env.js';
import {
  APP_NAME,
  ERROR_CODES,
  ROLE_VALUES,
  TOKEN_EXPIRY,
  TOKEN_LIMITS,
} from '../../constants/index.js';
import { AppError } from '../../lib/app-error.js';
import type { AuthContext, TokenPair } from './auth.schema.js';
import type { RefreshTokensRepository } from './refresh-tokens.repository.js';

const ALGORITHM = 'HS256';
const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const accessClaimsSchema = z.object({ sub: z.string(), role: z.enum(ROLE_VALUES) });

export const signAccessToken = ({ userId, role }: AuthContext) =>
  new SignJWT({ role })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(userId)
    .setIssuer(APP_NAME)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY.ACCESS)
    .sign(accessSecret);

export const verifyAccessToken = async (token: string): Promise<AuthContext> => {
  try {
    const { payload } = await jwtVerify(token, accessSecret, {
      algorithms: [ALGORITHM],
      issuer: APP_NAME,
    });
    const claims = accessClaimsSchema.parse(payload);
    return { userId: claims.sub, role: claims.role };
  } catch {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }
};

export const hashRefreshToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const issueTokenPair = async (
  refreshTokensRepo: RefreshTokensRepository,
  { userId, role }: AuthContext,
): Promise<TokenPair> => {
  const refreshToken = randomBytes(TOKEN_LIMITS.REFRESH_TOKEN_BYTES).toString('base64url');
  await refreshTokensRepo.create({
    tokenHash: hashRefreshToken(refreshToken),
    userId,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY.REFRESH_MS),
  });
  return { accessToken: await signAccessToken({ userId, role }), refreshToken };
};
