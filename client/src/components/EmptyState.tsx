interface EmptyStateProps {
  title: string;
}

export const EmptyState = ({ title }: EmptyStateProps) => (
  <p className="py-8 text-center text-sm text-slate-500">{title}</p>
);
