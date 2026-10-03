import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Pagination } from '../../components/Pagination';
import { Spinner } from '../../components/Spinner';
import { PAGINATION } from '../../constants';
import { toErrorMessageKey } from '../../lib/api-error';
import { useUsers } from './useUsers';
import { UsersTable } from './UsersTable';

export const UsersList = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(PAGINATION.FIRST_PAGE);
  const users = useUsers(page);

  if (users.isPending) return <Spinner />;
  if (users.isError) {
    return (
      <ErrorState message={t(toErrorMessageKey(users.error))} onRetry={() => users.refetch()} />
    );
  }
  if (users.data.items.length === 0) return <EmptyState title={t('users.list.emptyTitle')} />;

  return (
    <div>
      <UsersTable users={users.data.items} />
      {users.data.meta.totalPages > 1 && (
        <Pagination page={page} totalPages={users.data.meta.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
