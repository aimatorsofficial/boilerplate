import { useTranslation } from 'react-i18next';
import { formatDate } from '../../lib/formatters';
import { ROLE_LABEL_KEYS, type User } from './users.schema';

interface UsersTableProps {
  users: User[];
}

const CELL_CLASS = 'px-4 py-2 text-start';

export const UsersTable = ({ users }: UsersTableProps) => {
  const { t, i18n } = useTranslation();

  return (
    <table className="w-full rounded-lg border border-slate-200 bg-white text-sm">
      <thead className="bg-slate-100 text-slate-600">
        <tr>
          <th className={CELL_CLASS}>{t('users.list.columns.name')}</th>
          <th className={CELL_CLASS}>{t('users.list.columns.email')}</th>
          <th className={CELL_CLASS}>{t('users.list.columns.role')}</th>
          <th className={CELL_CLASS}>{t('users.list.columns.createdAt')}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-t border-slate-200">
            <td className={CELL_CLASS}>{user.name}</td>
            <td className={CELL_CLASS}>{user.email}</td>
            <td className={CELL_CLASS}>{t(ROLE_LABEL_KEYS[user.role])}</td>
            <td className={CELL_CLASS}>{formatDate(user.createdAt, i18n.language)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
