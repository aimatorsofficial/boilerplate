import type { ButtonHTMLAttributes } from 'react';

const VARIANT_CLASSES = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700',
  secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    className={`rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
