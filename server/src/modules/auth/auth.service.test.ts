import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ERROR_CODES, ROLES, TOKEN_EXPIRY } from '../../constants/index.js';
import { MemoryRefreshTokensRepository } from '../../database/memory/refresh-tokens.memory.js';
import { MemoryUsersRepository } from '../../database/memory/users.memory.js';
import { createUsersService } from '../users/users.service.js';
import { createAuthService, type AuthService } from './auth.service.js';
import { verifyAccessToken } from './auth.tokens.js';

const asha = { name: 'Asha', email: 'asha@example.com', password: 'a-long-password' };

let usersRepo: MemoryUsersRepository;
let service: AuthService;

beforeEach(() => {
  usersRepo = new MemoryUsersRepository();
  service = createAuthService({
    usersService: createUsersService(usersRepo),
    usersRepo,
    refreshTokensRepo: new MemoryRefreshTokensRepository(),
  });
});

describe('register', () => {
  it('creates a normal user and returns a token pair for them', async () => {
    const tokens = await service.register(asha);

    const auth = await verifyAccessToken(tokens.accessToken);
    const user = await usersRepo.findByEmail(asha.email);

    expect(auth).toEqual({ userId: user?.id, role: ROLES.USER });
  });

  it('rejects an email that is already registered', async () => {
    await service.register(asha);

    await expect(service.register(asha)).rejects.toMatchObject({
      code: ERROR_CODES.EMAIL_TAKEN,
    });
  });
});

describe('login', () => {
  it('returns a token pair for the right password', async () => {
    await service.register(asha);

    const tokens = await service.login({ email: asha.email, password: asha.password });

    expect(tokens.refreshToken).toBeTypeOf('string');
  });

  it('rejects a wrong password with INVALID_CREDENTIALS', async () => {
    await service.register(asha);

    await expect(service.login({ email: asha.email, password: 'wrong' })).rejects.toMatchObject({
      code: ERROR_CODES.INVALID_CREDENTIALS,
    });
  });

  it('rejects an unknown email with the same INVALID_CREDENTIALS code', async () => {
    await expect(
      service.login({ email: 'nobody@example.com', password: 'x' }),
    ).rejects.toMatchObject({ code: ERROR_CODES.INVALID_CREDENTIALS });
  });
});

describe('refresh', () => {
  it('swaps a refresh token for a new pair', async () => {
    const first = await service.register(asha);

    const second = await service.refresh(first.refreshToken);

    expect(second.refreshToken).not.toBe(first.refreshToken);
  });

  it('rejects a refresh token that was already used', async () => {
    const { refreshToken } = await service.register(asha);
    await service.refresh(refreshToken);

    await expect(service.refresh(refreshToken)).rejects.toMatchObject({
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
  });

  it('rejects an unknown refresh token', async () => {
    await expect(service.refresh('made-up')).rejects.toMatchObject({
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
  });

  it('rejects an expired refresh token', async () => {
    const { refreshToken } = await service.register(asha);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + TOKEN_EXPIRY.REFRESH_MS + 1);

    await expect(service.refresh(refreshToken)).rejects.toMatchObject({
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
    vi.useRealTimers();
  });

  it('rejects a refresh token whose user was deleted', async () => {
    const { refreshToken } = await service.register(asha);
    const user = await usersRepo.findByEmail(asha.email);
    await usersRepo.delete(user?.id ?? '');

    await expect(service.refresh(refreshToken)).rejects.toMatchObject({
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
  });
});

describe('logout', () => {
  it('makes the refresh token unusable', async () => {
    const { refreshToken } = await service.register(asha);

    await service.logout(refreshToken);

    await expect(service.refresh(refreshToken)).rejects.toMatchObject({
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
  });
});

describe('me', () => {
  it('returns the current user without the password hash', async () => {
    const { accessToken } = await service.register(asha);
    const { userId } = await verifyAccessToken(accessToken);

    const user = await service.me(userId);

    expect(user).toMatchObject({ name: asha.name, email: asha.email, role: ROLES.USER });
    expect(user).not.toHaveProperty('passwordHash');
  });
});
