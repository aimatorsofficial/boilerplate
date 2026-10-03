import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROLES, ROUTES } from '../../constants';
import { adminUser, normalUser, signInAs } from '../../test/fixtures';
import { renderRoutes, routeMarker } from '../../test/render';
import { server } from '../../test/server';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

const routes = [
  { element: <ProtectedRoute />, children: [routeMarker(ROUTES.PROFILE)] },
  { element: <ProtectedRoute requiredRole={ROLES.ADMIN} />, children: [routeMarker(ROUTES.USERS)] },
  { element: <GuestRoute />, children: [routeMarker(ROUTES.LOGIN)] },
  routeMarker(ROUTES.HOME),
];

describe('ProtectedRoute', () => {
  it('sends a signed-out visitor to the login page', async () => {
    renderRoutes(routes, ROUTES.PROFILE);

    expect(await screen.findByText(`at ${ROUTES.LOGIN}`)).toBeVisible();
  });

  it('shows the page to a signed-in user', async () => {
    server.use(signInAs(normalUser));
    renderRoutes(routes, ROUTES.PROFILE);

    expect(await screen.findByText(`at ${ROUTES.PROFILE}`)).toBeVisible();
  });

  it('sends a non-admin away from an admin page', async () => {
    server.use(signInAs(normalUser));
    renderRoutes(routes, ROUTES.USERS);

    expect(await screen.findByText(`at ${ROUTES.HOME}`)).toBeVisible();
  });

  it('shows an admin page to an admin', async () => {
    server.use(signInAs(adminUser));
    renderRoutes(routes, ROUTES.USERS);

    expect(await screen.findByText(`at ${ROUTES.USERS}`)).toBeVisible();
  });
});

describe('GuestRoute', () => {
  it('sends a signed-in user away from the login page', async () => {
    server.use(signInAs(normalUser));
    renderRoutes(routes, ROUTES.LOGIN);

    expect(await screen.findByText(`at ${ROUTES.HOME}`)).toBeVisible();
  });
});
