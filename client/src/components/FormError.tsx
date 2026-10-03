import { useTranslation } from 'react-i18next';
import { toErrorMessageKey } from '../lib/api-error';

interface FormErrorProps {
  error: unknown;
}

export const FormError = ({ error }: FormErrorProps) => {
  const { t } = useTranslation();
  if (!error) return null;

  return (
    <p role="alert" className="text-sm text-red-700">
      {t(toErrorMessageKey(error))}
    </p>
  );
};
