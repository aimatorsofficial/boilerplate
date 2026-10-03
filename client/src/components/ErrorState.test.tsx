import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { i18n } from '../lib/i18n';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('announces the message as an alert', () => {
    render(<ErrorState message="Failed" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });

  it('offers a retry button only when a handler is given', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<ErrorState message="Failed" />);
    expect(screen.queryByRole('button')).toBeNull();

    rerender(<ErrorState message="Failed" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: i18n.t('common.retry') }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
