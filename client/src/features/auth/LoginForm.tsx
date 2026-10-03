import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { FormError } from '../../components/FormError';
import { TextField } from '../../components/TextField';
import { ROUTES } from '../../constants';
import { AuthSwitchLink } from './AuthSwitchLink';
import { useAuthForm } from './useAuthForm';
import { useLogin } from './useSession';

export const LoginForm = () => {
  const { t } = useTranslation();
  const login = useLogin();
  const { fieldProps, handleSubmit } = useAuthForm({ email: '', password: '' }, login);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label={t('auth.fields.email')}
        type="email"
        autoComplete="email"
        required
        {...fieldProps('email')}
      />
      <TextField
        label={t('auth.fields.password')}
        type="password"
        autoComplete="current-password"
        required
        {...fieldProps('password')}
      />
      <FormError error={login.error} />
      <Button type="submit" isLoading={login.isPending}>
        {t('auth.login.submit')}
      </Button>
      <AuthSwitchLink
        prompt={t('auth.login.noAccount')}
        linkText={t('auth.login.registerLink')}
        to={ROUTES.REGISTER}
      />
    </form>
  );
};
