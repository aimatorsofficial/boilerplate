import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../constants';
import { tokenStore } from './token-store';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('tokenStore', () => {
  it('keeps the access token in memory and the refresh token in localStorage', () => {
    tokenStore.save({ accessToken: 'access', refreshToken: 'refresh' });

    expect(tokenStore.getAccessToken()).toBe('access');
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('refresh');
    expect(JSON.stringify(localStorage)).not.toContain('access');
  });

  it('reports a session from a stored refresh token after a reload', () => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

    expect(tokenStore.getAccessToken()).toBeNull();
    expect(tokenStore.hasSession()).toBe(true);
  });

  it('forgets both tokens on clear', () => {
    tokenStore.save({ accessToken: 'access', refreshToken: 'refresh' });

    tokenStore.clear();

    expect(tokenStore.hasSession()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('falls back to memory when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    tokenStore.save({ accessToken: 'access', refreshToken: 'refresh' });

    expect(tokenStore.getRefreshToken()).toBe('refresh');
  });
});
