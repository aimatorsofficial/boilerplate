import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { CenteredCard } from '../components/CenteredCard';
import { ROUTES } from '../constants';

export const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <CenteredCard title={t('notFound.title')}>
      <Link to={ROUTES.HOME} className="text-sm font-medium text-slate-900 underline">
        {t('notFound.backHome')}
      </Link>
    </CenteredCard>
  );
};
