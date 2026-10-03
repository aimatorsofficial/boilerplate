import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { ROUTES } from '../constants';
import { Button } from './Button';

interface AppHeaderProps {
  userName: string;
  showUsersLink: boolean;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`;

export const AppHeader = ({ userName, showUsersLink, onLogout, isLoggingOut }: AppHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3">
        <span className="font-semibold text-slate-900">{t('app.name')}</span>
        <nav className="flex flex-1 items-center gap-4">
          {showUsersLink && (
            <NavLink to={ROUTES.USERS} className={navLinkClass}>
              {t('nav.users')}
            </NavLink>
          )}
          <NavLink to={ROUTES.PROFILE} className={navLinkClass}>
            {t('nav.profile')}
          </NavLink>
        </nav>
        <span className="text-sm text-slate-600">{userName}</span>
        <Button variant="secondary" onClick={onLogout} isLoading={isLoggingOut}>
          {t('nav.logout')}
        </Button>
      </div>
    </header>
  );
};
