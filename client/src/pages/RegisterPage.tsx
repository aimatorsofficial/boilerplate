import { useTranslation } from 'react-i18next';
import { CenteredCard } from '../components/CenteredCard';
import { RegisterForm } from '../features/auth/RegisterForm';

export const RegisterPage = () => {
  const { t } = useTranslation();
  return (
    <CenteredCard title={t('auth.register.title')}>
      <RegisterForm />
    </CenteredCard>
  );
};
