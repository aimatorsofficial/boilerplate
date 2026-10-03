import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center justify-between gap-4 pt-4">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        {t('common.previous')}
      </Button>
      <span className="text-sm text-slate-600">{t('common.pageOf', { page, totalPages })}</span>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('common.next')}
      </Button>
    </nav>
  );
};
