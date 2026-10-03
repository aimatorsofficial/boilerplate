import { useTranslation } from 'react-i18next';

export const Spinner = () => {
  const { t } = useTranslation();

  return (
    <div role="status" aria-label={t('common.loading')} className="flex justify-center py-8">
      <span className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
    </div>
  );
};
