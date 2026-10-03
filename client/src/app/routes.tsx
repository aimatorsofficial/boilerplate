import type { RouteObject } from 'react-router';
import { Spinner } from '../components/Spinner';
import { ROLES, ROUTES } from '../constants';
import { AuthenticatedLayout } from '../features/auth/AuthenticatedLayout';
import { GuestRoute } from '../features/auth/GuestRoute';
import { HomeRedirect } from '../features/auth/HomeRedirect';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

const pages = {
  login: async () => ({ Component: (await import('../pages/LoginPage')).LoginPage }),
  register: async () => ({ Component: (await import('../pages/RegisterPage')).RegisterPage }),
  profile: async () => ({ Component: (await import('../pages/ProfilePage')).ProfilePage }),
  users: async () => ({ Component: (await import('../pages/UsersPage')).UsersPage }),
  notFound: async () => ({ Component: (await import('../pages/NotFoundPage')).NotFoundPage }),
};

const guestRoutes: RouteObject = {
  element: <GuestRoute />,
  children: [
    { path: ROUTES.LOGIN, lazy: pages.login },
    { path: ROUTES.REGISTER, lazy: pages.register },
  ],
};

const signedInRoutes: RouteObject = {
  element: <ProtectedRoute />,
  children: [
    {
      element: <AuthenticatedLayout />,
      children: [
        { path: ROUTES.HOME, element: <HomeRedirect /> },
        { path: ROUTES.PROFILE, lazy: pages.profile },
        {
          element: <ProtectedRoute requiredRole={ROLES.ADMIN} />,
          children: [{ path: ROUTES.USERS, lazy: pages.users }],
        },
      ],
    },
  ],
};

export const appRoutes: RouteObject[] = [
  {
    HydrateFallback: Spinner,
    children: [guestRoutes, signedInRoutes, { path: ROUTES.NOT_FOUND, lazy: pages.notFound }],
  },
];
