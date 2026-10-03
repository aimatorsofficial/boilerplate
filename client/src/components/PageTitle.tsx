interface PageTitleProps {
  children: string;
}

export const PageTitle = ({ children }: PageTitleProps) => (
  <h1 className="mb-6 text-2xl font-semibold text-slate-900">{children}</h1>
);
