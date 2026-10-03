import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, MemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { queryClient } from '../lib/query-client';

export const renderWithProviders = (ui: ReactElement, initialPath = '/') =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );

export const renderRoutes = (routes: RouteObject[], initialPath: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
};

export const routeMarker = (path: string) => ({ path, element: <p>{`at ${path}`}</p> });
