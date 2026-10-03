import { Outlet } from 'react-router';
import { AppHeader } from '../../components/AppHeader';
import { ROLES } from '../../constants';
import { useCurrentUser } from './useCurrentUser';
import { useLogout } from './useSession';

export const AuthenticatedLayout = () => {
  const { user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        userName={user?.name ?? ''}
        showUsersLink={user?.role === ROLES.ADMIN}
        onLogout={() => logout.mutate()}
        isLoggingOut={logout.isPending}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
