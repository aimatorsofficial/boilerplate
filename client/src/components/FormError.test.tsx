import { render, screen } from '@testing-library/react';
import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { i18n } from '../lib/i18n';
import { FormError } from './FormError';

describe('FormError', () => {
  it('renders nothing without an error', () => {
    const { container } = render(<FormError error={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the translated message for the error', () => {
    render(<FormError error={new AxiosError('offline', 'ERR_NETWORK')} />);

    expect(screen.getByRole('alert')).toHaveTextContent(i18n.t('errors.NETWORK'));
  });
});
