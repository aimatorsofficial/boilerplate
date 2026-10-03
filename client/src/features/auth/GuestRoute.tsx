import { Navigate, Outlet } from 'react-router';
import { Spinner } from '../../components/Spinner';
import { ROUTES } from '../../constants';
import { useCurrentUser } from './useCurrentUser';

export const GuestRoute = () => {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <Spinner />;
  if (user) return <Navigate to={ROUTES.HOME} replace />;
  return <Outlet />;
};
