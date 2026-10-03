import type { ReactNode } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PageTitle } from './PageTitle';

interface CenteredCardProps {
  title: string;
  children: ReactNode;
}

export const CenteredCard = ({ title, children }: CenteredCardProps) => (
  <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="absolute end-4 top-4">
      <LanguageSwitcher />
    </div>
    <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <PageTitle>{title}</PageTitle>
      {children}
    </section>
  </main>
);
