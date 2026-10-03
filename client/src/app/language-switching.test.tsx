import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../constants';
import { formatDate } from '../lib/formatters';
import { i18n } from '../lib/i18n';
import { normalUser, signInAs } from '../test/fixtures';
import { renderRoutes } from '../test/render';
import { server } from '../test/server';
import { appRoutes } from './routes';

describe('switching language', () => {
  it('translates the whole signed-in screen, including dates', async () => {
    server.use(signInAs(normalUser));
    renderRoutes(appRoutes, ROUTES.PROFILE);
    await screen.findByText(normalUser.email);

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: i18n.t('language.label') }),
      'hi',
    );

    expect(
      await screen.findByRole('heading', { level: 1, name: i18n.t('profile.title') }),
    ).toHaveTextContent('मेरी प्रोफ़ाइल');
    expect(screen.getByRole('button', { name: i18n.t('nav.logout') })).toBeVisible();
    expect(screen.getByText(i18n.t('roles.user'))).toBeVisible();
    expect(screen.getByText(formatDate(normalUser.createdAt, 'hi'))).toBeVisible();
  });

  it('lets a signed-out visitor switch on the login page', async () => {
    renderRoutes(appRoutes, ROUTES.LOGIN);

    await userEvent.selectOptions(
      await screen.findByRole('combobox', { name: i18n.t('language.label') }),
      'hi',
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('लॉग इन करें');
  });
});
