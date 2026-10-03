import { screen } from '@testing-library/react';
import type { ParseKeys } from 'i18next';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_PATHS, PAGINATION, ROUTES } from '../constants';
import { i18n } from '../lib/i18n';
import { adminUser, normalUser, signInAs } from '../test/fixtures';
import { renderRoutes } from '../test/render';
import { apiUrl, server } from '../test/server';
import { appRoutes } from './routes';

const usersPage = () =>
  HttpResponse.json({
    data: [adminUser],
    meta: { page: 1, limit: PAGINATION.PAGE_SIZE, total: 1, totalPages: 1 },
  });

const heading = (key: ParseKeys) => screen.findByRole('heading', { level: 1, name: i18n.t(key) });

describe('app routes', () => {
  it('shows the login page to a signed-out visitor', async () => {
    const router = renderRoutes(appRoutes, ROUTES.HOME);

    expect(await heading('auth.login.title')).toBeVisible();
    expect(router.state.location.pathname).toBe(ROUTES.LOGIN);
  });

  it('takes an admin from home to the users list', async () => {
    server.use(signInAs(adminUser), http.get(apiUrl(API_PATHS.USERS), usersPage));
    const router = renderRoutes(appRoutes, ROUTES.HOME);

    expect(await heading('users.list.title')).toBeVisible();
    expect(router.state.location.pathname).toBe(ROUTES.USERS);
  });

  it('takes a normal user from home to their profile', async () => {
    server.use(signInAs(normalUser));
    const router = renderRoutes(appRoutes, ROUTES.HOME);

    expect(await heading('profile.title')).toBeVisible();
    expect(await screen.findByText(normalUser.email)).toBeVisible();
    expect(router.state.location.pathname).toBe(ROUTES.PROFILE);
  });

  it('keeps a normal user out of the users list', async () => {
    server.use(signInAs(normalUser));
    const router = renderRoutes(appRoutes, ROUTES.USERS);

    expect(await heading('profile.title')).toBeVisible();
    expect(router.state.location.pathname).toBe(ROUTES.PROFILE);
  });

  it('shows the not-found page for an unknown address', async () => {
    renderRoutes(appRoutes, '/no/such/page');

    expect(await heading('notFound.title')).toBeVisible();
  });
});
