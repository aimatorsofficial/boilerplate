import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { i18n } from '../lib/i18n';
import { EmptyState } from './EmptyState';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('is announced as a loading status', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: i18n.t('common.loading') })).toBeVisible();
  });
});

describe('EmptyState', () => {
  it('shows its title', () => {
    render(<EmptyState title="Nothing here" />);

    expect(screen.getByText('Nothing here')).toBeVisible();
  });
});
