import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../constants';

type StringFields<T> = { [K in keyof T]: string };

interface SubmitsValues<T> {
  mutate: (values: T, options: { onSuccess: () => void }) => void;
}

export const useAuthForm = <T extends StringFields<T>>(
  initialValues: T,
  mutation: SubmitsValues<T>,
) => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);

  const fieldProps = (field: keyof T) => ({
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value })),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate(values, { onSuccess: () => navigate(ROUTES.HOME) });
  };

  return { fieldProps, handleSubmit };
};
