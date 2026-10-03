import { Navigate, Outlet } from 'react-router';
import { Spinner } from '../../components/Spinner';
import { ROUTES, type Role } from '../../constants';
import { useCurrentUser } from './useCurrentUser';

interface ProtectedRouteProps {
  requiredRole?: Role;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to={ROUTES.HOME} replace />;
  return <Outlet />;
};
