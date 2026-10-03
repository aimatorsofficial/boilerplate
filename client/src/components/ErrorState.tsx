import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  const { t } = useTranslation();

  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};
