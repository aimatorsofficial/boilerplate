import { useTranslation } from 'react-i18next';
import { CenteredCard } from '../components/CenteredCard';
import { LoginForm } from '../features/auth/LoginForm';

export const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <CenteredCard title={t('auth.login.title')}>
      <LoginForm />
    </CenteredCard>
  );
};
