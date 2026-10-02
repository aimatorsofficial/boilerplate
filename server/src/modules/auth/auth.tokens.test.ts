import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';
import { env } from '../../config/env.js';
import { APP_NAME, ERROR_CODES, ROLES } from '../../constants/index.js';
import { MemoryRefreshTokensRepository } from '../../database/memory/refresh-tokens.memory.js';
import {
  hashRefreshToken,
  issueTokenPair,
  signAccessToken,
  verifyAccessToken,
} from './auth.tokens.js';

const auth = { userId: 'user-1', role: ROLES.ADMIN };

describe('access tokens', () => {
  it('round-trips the user id and role', async () => {
    const token = await signAccessToken(auth);

    expect(await verifyAccessToken(token)).toEqual(auth);
  });

  it('rejects a tampered token with UNAUTHORIZED', async () => {
    const token = await signAccessToken(auth);
    const tampered = `${token.slice(0, -2)}xx`;

    await expect(verifyAccessToken(tampered)).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
    });
  });

  it('rejects a token signed with another secret', async () => {
    const foreign = await new SignJWT({ role: ROLES.ADMIN })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('user-1')
      .setIssuer(APP_NAME)
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode('another-secret-that-is-long-enough-123'));

    await expect(verifyAccessToken(foreign)).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
    });
  });

  it('rejects an expired token', async () => {
    const expired = await new SignJWT({ role: ROLES.USER })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('user-1')
      .setIssuer(APP_NAME)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(new TextEncoder().encode(env.JWT_ACCESS_SECRET));

    await expect(verifyAccessToken(expired)).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
    });
  });
});

describe('issueTokenPair', () => {
  it('stores only the hash of the refresh token', async () => {
    const repo = new MemoryRefreshTokensRepository();

    const { refreshToken } = await issueTokenPair(repo, auth);

    expect(await repo.consume(refreshToken)).toBeNull();
    expect(await repo.consume(hashRefreshToken(refreshToken))).toMatchObject({
      userId: auth.userId,
    });
  });
});
