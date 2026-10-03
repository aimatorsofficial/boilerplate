import type { RouteObject } from 'react-router';
import { ROLES, ROUTES } from '../constants';
import { AuthenticatedLayout } from '../features/auth/AuthenticatedLayout';
import { GuestRoute } from '../features/auth/GuestRoute';
import { HomeRedirect } from '../features/auth/HomeRedirect';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { UsersPage } from '../pages/UsersPage';

const adminOnlyRoutes: RouteObject = {
  element: <ProtectedRoute requiredRole={ROLES.ADMIN} />,
  children: [{ path: ROUTES.USERS, element: <UsersPage /> }],
};

export const appRoutes: RouteObject[] = [
  {
    element: <GuestRoute />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          { path: ROUTES.HOME, element: <HomeRedirect /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
          adminOnlyRoutes,
        ],
      },
    ],
  },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
];
