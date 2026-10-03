import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { i18n } from '../lib/i18n';
import { renderWithProviders } from '../test/render';
import { AppHeader } from './AppHeader';

const usersLink = () => screen.queryByRole('link', { name: i18n.t('nav.users') });

describe('AppHeader', () => {
  it('hides the users link when not allowed', () => {
    renderWithProviders(<AppHeader userName="Asha" showUsersLink={false} onLogout={vi.fn()} />);

    expect(usersLink()).toBeNull();
  });

  it('shows the users link when allowed', () => {
    renderWithProviders(<AppHeader userName="Asha" showUsersLink onLogout={vi.fn()} />);

    expect(usersLink()).toBeVisible();
  });

  it('calls onLogout from the logout button', async () => {
    const onLogout = vi.fn();
    renderWithProviders(<AppHeader userName="Asha" showUsersLink onLogout={onLogout} />);

    await userEvent.click(screen.getByRole('button', { name: i18n.t('nav.logout') }));

    expect(onLogout).toHaveBeenCalledOnce();
  });
});
