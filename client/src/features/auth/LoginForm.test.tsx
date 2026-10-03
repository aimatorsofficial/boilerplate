import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_PATHS, ROUTES, STORAGE_KEYS } from '../../constants';
import { i18n } from '../../lib/i18n';
import { apiError, currentUserHandler, normalUser, tokenPair } from '../../test/fixtures';
import { renderRoutes, routeMarker } from '../../test/render';
import { apiUrl, server } from '../../test/server';
import { LoginForm } from './LoginForm';

const renderLogin = () =>
  renderRoutes(
    [{ path: ROUTES.LOGIN, element: <LoginForm /> }, routeMarker(ROUTES.HOME)],
    ROUTES.LOGIN,
  );

const fillAndSubmit = async (email: string, password: string) => {
  await userEvent.type(screen.getByLabelText(i18n.t('auth.fields.email')), email);
  await userEvent.type(screen.getByLabelText(i18n.t('auth.fields.password')), password);
  await userEvent.click(screen.getByRole('button', { name: i18n.t('auth.login.submit') }));
};

describe('LoginForm', () => {
  it('logs in, keeps the refresh token and goes home', async () => {
    server.use(
      http.post(apiUrl(API_PATHS.LOGIN), () => HttpResponse.json({ data: tokenPair })),
      currentUserHandler(normalUser),
    );
    renderLogin();

    await fillAndSubmit(normalUser.email, 'a-long-password');

    expect(await screen.findByText(`at ${ROUTES.HOME}`)).toBeVisible();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe(tokenPair.refreshToken);
  });

  it('shows the wrong-credentials message and stays on the page', async () => {
    server.use(http.post(apiUrl(API_PATHS.LOGIN), () => apiError('INVALID_CREDENTIALS', 401)));
    renderLogin();

    await fillAndSubmit(normalUser.email, 'wrong-password');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      i18n.t('errors.INVALID_CREDENTIALS'),
    );
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('shows the rate-limit message after too many attempts', async () => {
    server.use(http.post(apiUrl(API_PATHS.LOGIN), () => apiError('TOO_MANY_REQUESTS', 429)));
    renderLogin();

    await fillAndSubmit(normalUser.email, 'any-password');

    expect(await screen.findByRole('alert')).toHaveTextContent(i18n.t('errors.TOO_MANY_REQUESTS'));
  });
});
