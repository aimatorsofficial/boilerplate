import { useTranslation } from 'react-i18next';
import { PageTitle } from '../components/PageTitle';
import { CurrentUserProfile } from '../features/auth/CurrentUserProfile';

export const ProfilePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('profile.title')}</PageTitle>
      <CurrentUserProfile />
    </>
  );
};
