import { useTranslation } from 'react-i18next';
import { PageTitle } from '../components/PageTitle';
import { UsersList } from '../features/users/UsersList';

export const UsersPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('users.list.title')}</PageTitle>
      <UsersList />
    </>
  );
};
