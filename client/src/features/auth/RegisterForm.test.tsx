import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_PATHS, ROUTES } from '../../constants';
import { i18n } from '../../lib/i18n';
import { apiError, currentUserHandler, normalUser, tokenPair } from '../../test/fixtures';
import { renderRoutes, routeMarker } from '../../test/render';
import { apiUrl, server } from '../../test/server';
import { RegisterForm } from './RegisterForm';

const renderRegister = () =>
  renderRoutes(
    [{ path: ROUTES.REGISTER, element: <RegisterForm /> }, routeMarker(ROUTES.HOME)],
    ROUTES.REGISTER,
  );

const fillAndSubmit = async () => {
  await userEvent.type(screen.getByLabelText(i18n.t('auth.fields.name')), normalUser.name);
  await userEvent.type(screen.getByLabelText(i18n.t('auth.fields.email')), normalUser.email);
  await userEvent.type(screen.getByLabelText(i18n.t('auth.fields.password')), 'a-long-password');
  await userEvent.click(screen.getByRole('button', { name: i18n.t('auth.register.submit') }));
};

describe('RegisterForm', () => {
  it('sends name, email and password, then goes home', async () => {
    let sentBody: unknown;
    server.use(
      http.post(apiUrl(API_PATHS.REGISTER), async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json({ data: tokenPair }, { status: 201 });
      }),
      currentUserHandler(normalUser),
    );
    renderRegister();

    await fillAndSubmit();

    expect(await screen.findByText(`at ${ROUTES.HOME}`)).toBeVisible();
    expect(sentBody).toEqual({
      name: normalUser.name,
      email: normalUser.email,
      password: 'a-long-password',
    });
  });

  it('shows the email-taken message', async () => {
    server.use(http.post(apiUrl(API_PATHS.REGISTER), () => apiError('EMAIL_TAKEN', 409)));
    renderRegister();

    await fillAndSubmit();

    expect(await screen.findByRole('alert')).toHaveTextContent(i18n.t('errors.EMAIL_TAKEN'));
  });

  it('tells the user the minimum password length', () => {
    renderRegister();

    expect(screen.getByLabelText(i18n.t('auth.fields.password'))).toHaveAccessibleDescription(
      i18n.t('auth.fields.passwordHint', { count: 8 }),
    );
  });
});
