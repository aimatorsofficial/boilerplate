import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_PATHS, PAGINATION } from '../../constants';
import { i18n } from '../../lib/i18n';
import { adminUser, apiError, normalUser } from '../../test/fixtures';
import { renderWithProviders } from '../../test/render';
import { apiUrl, server } from '../../test/server';
import type { User } from './users.schema';
import { UsersList } from './UsersList';

const pageOf = (items: User[], page: number, totalPages: number) => ({
  data: items,
  meta: { page, limit: PAGINATION.PAGE_SIZE, total: items.length, totalPages },
});

describe('UsersList', () => {
  it('shows a row per user with a translated role', async () => {
    server.use(
      http.get(apiUrl(API_PATHS.USERS), () =>
        HttpResponse.json(pageOf([adminUser, normalUser], 1, 1)),
      ),
    );
    renderWithProviders(<UsersList />);

    expect(await screen.findByText(adminUser.email)).toBeVisible();
    expect(screen.getByText(normalUser.email)).toBeVisible();
    expect(screen.getByText(i18n.t('roles.admin'))).toBeVisible();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('shows the empty state when there are no users', async () => {
    server.use(http.get(apiUrl(API_PATHS.USERS), () => HttpResponse.json(pageOf([], 1, 0))));
    renderWithProviders(<UsersList />);

    expect(await screen.findByText(i18n.t('users.list.emptyTitle'))).toBeVisible();
  });

  it('shows an error with a working retry button', async () => {
    let calls = 0;
    server.use(
      http.get(apiUrl(API_PATHS.USERS), () => {
        calls += 1;
        return calls === 1
          ? apiError('FORBIDDEN', 403)
          : HttpResponse.json(pageOf([normalUser], 1, 1));
      }),
    );
    renderWithProviders(<UsersList />);

    expect(await screen.findByRole('alert')).toHaveTextContent(i18n.t('errors.FORBIDDEN'));
    await userEvent.click(screen.getByRole('button', { name: i18n.t('common.retry') }));

    expect(await screen.findByText(normalUser.email)).toBeVisible();
  });

  it('requests the next page with the page size from constants', async () => {
    const requested: string[] = [];
    server.use(
      http.get(apiUrl(API_PATHS.USERS), ({ request }) => {
        const url = new URL(request.url);
        requested.push(`${url.searchParams.get('page')}/${url.searchParams.get('limit')}`);
        const page = Number(url.searchParams.get('page'));
        return HttpResponse.json(pageOf([page === 1 ? adminUser : normalUser], page, 2));
      }),
    );
    renderWithProviders(<UsersList />);

    await userEvent.click(await screen.findByRole('button', { name: i18n.t('common.next') }));

    expect(await screen.findByText(normalUser.email)).toBeVisible();
    expect(requested).toEqual([`1/${PAGINATION.PAGE_SIZE}`, `2/${PAGINATION.PAGE_SIZE}`]);
  });
});
