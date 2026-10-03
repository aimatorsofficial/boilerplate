import { http, HttpResponse } from 'msw';
import { API_PATHS, ROLES } from '../constants';
import type { User } from '../features/users/users.schema';
import { tokenStore } from '../lib/token-store';
import { apiUrl } from './server';

export const normalUser: User = {
  id: 'user-1',
  name: 'Asha',
  email: 'asha@example.com',
  role: ROLES.USER,
  createdAt: '2026-10-02T12:00:00.000Z',
};

export const adminUser: User = {
  id: 'admin-1',
  name: 'Ravi',
  email: 'ravi@example.com',
  role: ROLES.ADMIN,
  createdAt: '2026-09-01T12:00:00.000Z',
};

export const tokenPair = { accessToken: 'access-1', refreshToken: 'refresh-1' };

export const apiError = (code: string, status: number) =>
  HttpResponse.json({ error: { code }, requestId: 'req-1' }, { status });

export const currentUserHandler = (user: User) =>
  http.get(apiUrl(API_PATHS.ME), () => HttpResponse.json({ data: user }));

export const signInAs = (user: User) => {
  tokenStore.save(tokenPair);
  return currentUserHandler(user);
};
