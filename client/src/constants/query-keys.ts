export const QUERY_KEYS = {
  CURRENT_USER: ['auth', 'me'],
  USERS: ['users'],
  usersPage: (page: number) => ['users', page],
} as const;
