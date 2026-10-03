import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_PATHS, QUERY_KEYS, STORAGE_KEYS } from '../constants';
import { apiUrl, server } from '../test/server';
import { apiClient } from './api-client';
import { queryClient } from './query-client';
import { tokenStore } from './token-store';

const unauthorized = () => HttpResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

const meRequiringToken = (validToken: string) =>
  http.get(apiUrl(API_PATHS.ME), ({ request }) =>
    request.headers.get('Authorization') === `Bearer ${validToken}`
      ? HttpResponse.json({ data: { ok: true } })
      : unauthorized(),
  );

const refreshReturning = (accessToken: string, calls: { count: number }) =>
  http.post(apiUrl(API_PATHS.REFRESH), () => {
    calls.count += 1;
    return HttpResponse.json({ data: { accessToken, refreshToken: `refresh-${calls.count}` } });
  });

describe('apiClient', () => {
  it('sends the access token as a bearer header', async () => {
    tokenStore.save({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    server.use(meRequiringToken('access-1'));

    const response = await apiClient.get(API_PATHS.ME);

    expect(response.data).toEqual({ data: { ok: true } });
  });

  it('refreshes once on a 401 and retries the request with the new token', async () => {
    const calls = { count: 0 };
    tokenStore.save({ accessToken: 'expired', refreshToken: 'refresh-0' });
    server.use(meRequiringToken('access-2'), refreshReturning('access-2', calls));

    const response = await apiClient.get(API_PATHS.ME);

    expect(response.status).toBe(200);
    expect(calls.count).toBe(1);
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('refresh-1');
  });

  it('shares one refresh between requests that fail at the same time', async () => {
    const calls = { count: 0 };
    tokenStore.save({ accessToken: 'expired', refreshToken: 'refresh-0' });
    server.use(meRequiringToken('access-2'), refreshReturning('access-2', calls));

    await Promise.all([apiClient.get(API_PATHS.ME), apiClient.get(API_PATHS.ME)]);

    expect(calls.count).toBe(1);
  });

  it('ends the session when the refresh fails', async () => {
    tokenStore.save({ accessToken: 'expired', refreshToken: 'revoked' });
    queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, { id: 'user-1' });
    server.use(
      meRequiringToken('never'),
      http.post(apiUrl(API_PATHS.REFRESH), () =>
        HttpResponse.json({ error: { code: 'REFRESH_TOKEN_INVALID' } }, { status: 401 }),
      ),
    );

    await expect(apiClient.get(API_PATHS.ME)).rejects.toThrow();

    expect(tokenStore.hasSession()).toBe(false);
    expect(queryClient.getQueryData(QUERY_KEYS.CURRENT_USER)).toBeNull();
  });

  it('can refresh again after an earlier attempt found no refresh token', async () => {
    const calls = { count: 0 };
    server.use(meRequiringToken('access-2'), refreshReturning('access-2', calls));
    await expect(apiClient.get(API_PATHS.ME)).rejects.toThrow();

    tokenStore.save({ accessToken: 'expired', refreshToken: 'refresh-0' });
    const response = await apiClient.get(API_PATHS.ME);

    expect(response.status).toBe(200);
  });

  it('does not try to refresh after a failed login', async () => {
    const calls = { count: 0 };
    server.use(
      http.post(apiUrl(API_PATHS.LOGIN), unauthorized),
      refreshReturning('access-2', calls),
    );

    await expect(apiClient.post(API_PATHS.LOGIN, {})).rejects.toThrow();

    expect(calls.count).toBe(0);
  });
});
