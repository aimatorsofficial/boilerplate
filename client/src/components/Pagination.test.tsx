import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { i18n } from '../lib/i18n';
import { Pagination } from './Pagination';

const previous = () => screen.getByRole('button', { name: i18n.t('common.previous') });
const next = () => screen.getByRole('button', { name: i18n.t('common.next') });

describe('Pagination', () => {
  it('shows the current page and total', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByText(i18n.t('common.pageOf', { page: 2, totalPages: 5 }))).toBeVisible();
  });

  it('disables previous on the first page and next on the last page', () => {
    render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />);

    expect(previous()).toBeDisabled();
    expect(next()).toBeDisabled();
  });

  it('asks for the neighbouring pages', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);

    await userEvent.click(previous());
    await userEvent.click(next());

    expect(onPageChange.mock.calls).toEqual([[1], [3]]);
  });
});
