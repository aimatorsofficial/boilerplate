import { useTranslation } from 'react-i18next';
import { formatDate } from '../../lib/formatters';
import { ROLE_LABEL_KEYS, type User } from '../users/users.schema';

interface ProfileCardProps {
  user: User;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const { t, i18n } = useTranslation();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
      <p className="text-sm text-slate-600">{user.email}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <dt className="text-slate-500">{t('profile.role')}</dt>
        <dd>{t(ROLE_LABEL_KEYS[user.role])}</dd>
        <dt className="text-slate-500">{t('profile.memberSince')}</dt>
        <dd>{formatDate(user.createdAt, i18n.language)}</dd>
      </dl>
    </section>
  );
};
