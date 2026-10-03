import { Navigate } from 'react-router';
import { ROLES, ROUTES } from '../../constants';
import { useCurrentUser } from './useCurrentUser';

export const HomeRedirect = () => {
  const { user } = useCurrentUser();
  return <Navigate to={user?.role === ROLES.ADMIN ? ROUTES.USERS : ROUTES.PROFILE} replace />;
};
