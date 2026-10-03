import { queryOptions, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants';
import { tokenStore } from '../../lib/token-store';
import type { User } from '../users/users.schema';
import { authApi } from './auth.api';

export const currentUserQuery = queryOptions<User | null>({
  queryKey: QUERY_KEYS.CURRENT_USER,
  queryFn: authApi.fetchCurrentUser,
  retry: false,
});

export const useCurrentUser = () => {
  const hasSession = tokenStore.hasSession();
  const query = useQuery({ ...currentUserQuery, enabled: hasSession });

  return {
    user: query.data ?? null,
    isLoading: hasSession && query.isPending,
  };
};
