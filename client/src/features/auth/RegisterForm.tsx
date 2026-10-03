import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { FormError } from '../../components/FormError';
import { TextField } from '../../components/TextField';
import { PASSWORD_MIN_LENGTH, ROUTES } from '../../constants';
import { AuthSwitchLink } from './AuthSwitchLink';
import { useAuthForm } from './useAuthForm';
import { useRegister } from './useSession';

const EMPTY_FORM = { name: '', email: '', password: '' };

export const RegisterForm = () => {
  const { t } = useTranslation();
  const register = useRegister();
  const { fieldProps, handleSubmit } = useAuthForm(EMPTY_FORM, register);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label={t('auth.fields.name')}
        autoComplete="name"
        required
        {...fieldProps('name')}
      />
      <TextField
        label={t('auth.fields.email')}
        type="email"
        autoComplete="email"
        required
        {...fieldProps('email')}
      />
      <TextField
        label={t('auth.fields.password')}
        hint={t('auth.fields.passwordHint', { count: PASSWORD_MIN_LENGTH })}
        type="password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN_LENGTH}
        {...fieldProps('password')}
      />
      <FormError error={register.error} />
      <Button type="submit" isLoading={register.isPending}>
        {t('auth.register.submit')}
      </Button>
      <AuthSwitchLink
        prompt={t('auth.register.haveAccount')}
        linkText={t('auth.register.loginLink')}
        to={ROUTES.LOGIN}
      />
    </form>
  );
};
