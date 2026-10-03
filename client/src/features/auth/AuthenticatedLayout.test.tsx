import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_PATHS, ROUTES } from '../../constants';
import { i18n } from '../../lib/i18n';
import { tokenStore } from '../../lib/token-store';
import { apiError, normalUser, signInAs } from '../../test/fixtures';
import { renderRoutes, routeMarker } from '../../test/render';
import { apiUrl, server } from '../../test/server';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ProfileCard } from './ProfileCard';

const routes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [{ path: ROUTES.PROFILE, element: <ProfileCard user={normalUser} /> }],
      },
    ],
  },
  routeMarker(ROUTES.LOGIN),
];

describe('AuthenticatedLayout', () => {
  it('shows the profile with the role label and join date', async () => {
    server.use(signInAs(normalUser));
    renderRoutes(routes, ROUTES.PROFILE);

    expect(await screen.findByText(normalUser.email)).toBeVisible();
    expect(screen.getByText(i18n.t('roles.user'))).toBeVisible();
    expect(screen.getByText('Oct 2, 2026')).toBeVisible();
  });

  it('logs out locally even when the logout request fails', async () => {
    server.use(
      signInAs(normalUser),
      http.post(apiUrl(API_PATHS.LOGOUT), () => apiError('INTERNAL_ERROR', 500)),
    );
    renderRoutes(routes, ROUTES.PROFILE);

    await userEvent.click(await screen.findByRole('button', { name: i18n.t('nav.logout') }));

    expect(await screen.findByText(`at ${ROUTES.LOGIN}`)).toBeVisible();
    expect(tokenStore.hasSession()).toBe(false);
  });
});
